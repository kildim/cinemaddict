import {removeChildren, render, replace} from '../utils/render';
import UserProfile from '../view/user-profile';
import MainMenu from '../view/main-menu';
import MoviesPresenter from './movies-presenter';
import FooterStatistics from '../view/footer-statistics';
import {Filters, Period} from '../constants';
import Loader from '../view/loader';
import ContentWrapper from '../view/content-wrapper';
import DetailsPresenter from './details-presenter';
import {ObserverType} from '../model/movies-model';
import StatisticsPresenter from './statistics-presenter';

export default class AppPresenter {
  #header = null;
  #main = null;
  #footer = null;
  #profile = null;
  #footerStats = null;
  #moviesModel = null;
  #menuSelection = null;
  #isDataLoading = null;
  #mainMenu = null;
  #moviesPresenter = null;
  #contentWrapper = null;
  #detailsWrapper = null;
  #detailsPresenter = null;
  #statsPresenter = null;

  constructor(moviesModel) {
    this.#header = document.querySelector('.header');
    this.#main = document.querySelector('.main');
    this.#footer = document.querySelector('.footer');
    this.#detailsWrapper = document.querySelector('.film-details');
    this.#moviesModel = moviesModel;
    this.#menuSelection = Filters.ALL_MOVES;


    this.#moviesPresenter = new MoviesPresenter(this.#moviesModel);

    this.#detailsPresenter = new DetailsPresenter({
      container: this.#detailsWrapper,
      detailsHandlers: {
        watchListClickHandler: this.switchWatchListFlagClickHandler,
        watchedClickHandler: this.switchWatchedFlagClickHandler,
        favoriteClickHandler: this.switchFavoriteFlagClickHandler
      }
    });

    this.#moviesModel.addObserver({
      observerType: ObserverType.FILMS_LOADED,
      observer: this.onFilmsLoaded
    });
    this.#moviesModel.addObserver({
      observerType: ObserverType.WATCHED_FLAG_CHANGES,
      observer: this.onWatchedFlagChanges
    });
    this.#moviesModel.addObserver({
      observerType: ObserverType.WATCHLIST_FLAG_CHANGES,
      observer: this.onWatchListFlagChanges
    });
    this.#moviesModel.addObserver({
      observerType: ObserverType.FAVORITE_FLAG_CHANGES,
      observer: this.onFavoriteFlagChanges
    });
  }

  init() {
    this.renderMainMenu();
    this.renderContentWrapper();
    this.renderFooterStats();

    this.#moviesPresenter.init({
      container: this.#contentWrapper,
      cardHandlers: {
        cardClickHandler: this.renderDetailsClickHandler,
        watchListClickHandler: this.switchWatchListFlagClickHandler,
        watchedClickHandler: this.switchWatchedFlagClickHandler,
        favoriteClickHandler: this.switchFavoriteFlagClickHandler
      },
    });

    this.#detailsPresenter = new DetailsPresenter({
      container: this.#detailsWrapper,
      detailsHandlers: {
        detailsCloseHandler: this.closeDetailsClickHandler,
        watchListClickHandler: this.switchWatchListFlagClickHandler,
        watchedClickHandler: this.switchWatchedFlagClickHandler,
        favoriteClickHandler: this.switchFavoriteFlagClickHandler,
      },
      commentListHandlers: {
        deleteCommentClickHandler: this.deleteCommentClickHandler,
        submitCommentClickHandler: this.submitCommentClickHandler,
      },
    });
    this.#statsPresenter = new StatisticsPresenter({
      moviesModel: this.#moviesModel,
      container: this.#contentWrapper
    });

    this.#isDataLoading = true;
    this.renderLoader();
  }

  submitCommentClickHandler = (comment) => {
    this.#detailsPresenter.blockCommentControls();
    this.#moviesModel.addComment({
      filmId: this.#detailsPresenter.filmId,
      comment: comment,
      addCommentCB: this.onCommentAdded,
      addCommentFailCB: this.onCommentAddFail,
    });
  }

  onCommentAdded = () => {
    this.#moviesModel.loadComments({
      filmId: this.#detailsPresenter.filmId,
      loadCommentsCB: this.onCommentsLoaded,
    });
  }

  onCommentAddFail = () => {
    this.#detailsPresenter.shake();
    this.#detailsPresenter.unblockCommentControls();
  }

  deleteCommentClickHandler = (commentId) => {
    this.#moviesModel.deleteComment({
      commentId: commentId,
      deleteCommentCB: this.onCommentDeleted,
      filmId: this.#detailsPresenter.filmId,
    });
  }

  renderDetailsClickHandler = (film) => () => {
    this.#detailsPresenter.isCommentsLoading = true;
    this.#detailsPresenter.renderDetails(film);

    this.#moviesModel.loadComments({
      filmId: film.id,
      loadCommentsCB: this.onCommentsLoaded,
    });
  }

  onCommentDeleted = () => {

    this.#moviesModel.loadComments({
      filmId: this.#detailsPresenter.filmId,
      loadCommentsCB: this.onCommentsLoaded,
    });
  }

  onCommentsLoaded = (comments) => {
    this.#detailsPresenter.isCommentsLoading = false;
    this.#detailsPresenter.renderComments(comments);
    this.#moviesPresenter.renderMostCommentedFilms();
  }

  updateDetails = (film) => {
    this.#detailsPresenter.updateDetails(film);
  }

  closeDetailsClickHandler = () => {
    this.#detailsPresenter.removeDetails();
  }

  switchWatchListFlagClickHandler = (film) => () => {
    this.#moviesModel.changeWatchedListFlag(film);
  }

  switchWatchedFlagClickHandler = (film) => () => {
    this.#moviesModel.changeFilmsWatchedFlag(film);
  }

  switchFavoriteFlagClickHandler = (film) => () => {
    this.#moviesModel.changeFavoriteFlag(film);
  }

  renderFilms = (filter) => {
    this.#moviesPresenter.clearContent();
    this.#menuSelection = filter;
    this.#moviesPresenter.renderFilmsContent();

    this.#moviesPresenter.renderFilmsList(this.#menuSelection);
    this.#moviesPresenter.renderTopRatedFilms();
    this.#moviesPresenter.renderMostCommentedFilms();

    this.renderMainMenu();
  }

  allMoviesClickHandler = () => {
    this.renderFilms(Filters.ALL_MOVES);
  }

  watchListClickHandler = () => {
    this.renderFilms(Filters.WATCHLIST);
  }

  historyClickHandler = () => {
    this.renderFilms(Filters.HISTORY);
  }

  favoritesClickHandler = () => {
    this.renderFilms(Filters.FAVORITES);
  }

  statsClickHandler = () => {
    this.#statsPresenter.clearContent();
    this.#menuSelection = Filters.STATS;

    this.#statsPresenter.changePeriodClickHandler(Period.ALL_TIME);
    this.renderMainMenu();
  }

  onFilmsLoaded = () => {
    this.#isDataLoading = false;
    removeChildren(this.#contentWrapper);
    this.renderInitContent();
  }

  onWatchedFlagChanges = (film) => {
    this.updateDetails(film);
    this.renderMainMenu();
    this.renderProfile();
    if (this.#menuSelection === Filters.HISTORY) {
      this.#moviesPresenter.removeCardFromFilmsList(film);
    } else {
      this.#moviesPresenter.updateCard(film);
    }
  }

  onWatchListFlagChanges = (film) => {
    this.updateDetails(film);
    this.renderMainMenu();
    if (this.#menuSelection === Filters.WATCHLIST) {
      this.#moviesPresenter.removeCardFromFilmsList(film);

    } else {
      this.#moviesPresenter.updateCard(film);
    }
  }

  onFavoriteFlagChanges = (film) => {
    this.updateDetails(film);
    this.renderMainMenu();
    if (this.#menuSelection === Filters.FAVORITES) {
      this.#moviesPresenter.removeCardFromFilmsList(film);
    } else {
      this.#moviesPresenter.updateCard(film);
    }
  }

  renderLoader = () => {
    render(this.#contentWrapper, new Loader());
  }

  renderMainMenu = () => {
    const MAIN_MENU_PROPS = {
      watchInfo: this.#moviesModel.watchInfo,
      activeMenu: this.#menuSelection,
      mainMenuHandlers: {
        allMoviesClickHandler: this.allMoviesClickHandler,
        watchListClickHandler: this.watchListClickHandler,
        historyClickHandler: this.historyClickHandler,
        favoritesClickHandler: this.favoritesClickHandler,
        statsClickHandler: this.statsClickHandler,
      }
    };
    if (this.#mainMenu === null) {
      this.#mainMenu = new MainMenu(MAIN_MENU_PROPS);
      render(this.#main, this.#mainMenu);
    } else {
      const newMenu = new MainMenu(MAIN_MENU_PROPS);
      replace(newMenu, this.#mainMenu);
      this.#mainMenu = newMenu;
    }
  }

  renderProfile = () => {
    const newProfile = new UserProfile(this.#moviesModel.userRank);

    if (this.#profile === null) {
      render(this.#header, newProfile);
    } else {
      replace(newProfile, this.#profile);
    }
    this.#profile = newProfile;
  }

  renderFooterStats = () => {
    const newFooterStats = new FooterStatistics(this.#moviesModel.filmsCount);

    if (this.#footerStats === null) {
      render(this.#footer, newFooterStats);
    } else {
      replace(newFooterStats, this.#footerStats);
    }
    this.#footerStats = newFooterStats;
  }

  renderContentWrapper = () => {
    const newContentWrapper = new ContentWrapper();

    if (this.#contentWrapper === null) {
      render(this.#main, newContentWrapper);
    } else {
      replace(newContentWrapper, this.#contentWrapper);
    }
    this.#contentWrapper = newContentWrapper;
  }

  renderInitContent = () => {
    this.renderProfile();
    this.renderMainMenu();

    if (this.#moviesModel.films.length > 0) {
      this.allMoviesClickHandler();
    } else {
      this.#moviesPresenter.renderDatabaseIsEmpty();
    }

    this.renderFooterStats();
  }
}
