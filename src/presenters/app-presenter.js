import {removeChildren, render, replace} from '../utils/render';
import UserProfile from '../view/user-profile';
import MainMenu from '../view/main-menu';
import MoviesPresenter from './movies-presenter';
import FooterStatistics from '../view/footer-statistics';
import {FILTERS, PERIOD} from '../constants';
import {Loader} from '../view/loader';
import ContentWrapper from '../view/content-wrapper';
import DetailsPresenter from './details-presenter';
import {OBSERVER_TYPE} from '../model/movies-model';
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
    this.#menuSelection = FILTERS.allMovies;


    this.#moviesPresenter = new MoviesPresenter(this.#moviesModel);

    this.#detailsPresenter = new DetailsPresenter({
      container: this.#detailsWrapper,
      detailsHandlers: {
        clickWatchListHandler: this.switchWatchListFlag,
        clickWatchedHandler: this.switchWatchedFlag,
        clickFavoriteHandler: this.switchFavoriteFlag
      }
    });

    this.#moviesModel.addObserver({
      observerType: OBSERVER_TYPE.filmsLoaded,
      observer: this.onFilmsLoaded
    });
    this.#moviesModel.addObserver({
      observerType: OBSERVER_TYPE.watchedFlagChanges,
      observer: this.onWatchedFlagChanges
    });
    this.#moviesModel.addObserver({
      observerType: OBSERVER_TYPE.watchlistFlagChanges,
      observer: this.onWatchListFlagChanges
    });
    this.#moviesModel.addObserver({
      observerType: OBSERVER_TYPE.favoriteFlagChanges,
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
        clickCardHandler: this.onRenderDetails,
        clickWatchListHandler: this.switchWatchListFlag,
        clickWatchedHandler: this.switchWatchedFlag,
        clickFavoriteHandler: this.switchFavoriteFlag
      },
    });

    this.#detailsPresenter = new DetailsPresenter({
      container: this.#detailsWrapper,
      detailsHandlers: {
        closeDetailsHandler: this.onCloseDetailsAction,
        clickWatchListHandler: this.switchWatchListFlag,
        clickWatchedHandler: this.switchWatchedFlag,
        clickFavoriteHandler: this.switchFavoriteFlag,
      },
      commentListHandlers: {
        clickDeleteHandler: this.deleteComment,
        clickSubmitCommentHandler: this.addComment,
      },
    });
    this.#statsPresenter = new StatisticsPresenter({
      moviesModel: this.#moviesModel,
      container: this.#contentWrapper
    });

    this.#isDataLoading = true;
    this.renderLoader();
  }

  addComment = (comment) => {
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

  deleteComment = (commentId) => {
    this.#moviesModel.deleteComment({
      commentId: commentId,
      deleteCommentCB: this.onCommentDeleted,
      filmId: this.#detailsPresenter.filmId,
    });
  }

  onRenderDetails = (film) => () => {
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

  onCloseDetailsAction = () => {
    this.#detailsPresenter.removeDetails();
  }

  switchWatchListFlag = (film) => () => {
    this.#moviesModel.changeWatchedListFlag(film);
  }

  switchWatchedFlag = (film) => () => {
    this.#moviesModel.changeFilmsWatchedFlag(film);
  }

  switchFavoriteFlag = (film) => () => {
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

  renderAllMovies = () => {
    this.renderFilms(FILTERS.allMovies);
  }

  renderWatchList = () => {
    this.renderFilms(FILTERS.watchlist);
  }

  renderHistory = () => {
    this.renderFilms(FILTERS.history);
  }

  renderFavorites = () => {
    this.renderFilms(FILTERS.favorites);
  }

  renderStats = () => {
    this.#statsPresenter.clearContent();
    this.#menuSelection = FILTERS.stats;

    this.#statsPresenter.onPeriodChanges(PERIOD.allTime);
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
    if (this.#menuSelection !== FILTERS.history) {
      this.#moviesPresenter.updateCard(film);
    } else {
      this.#moviesPresenter.removeCardFromFilmsList(film);
    }
  }

  onWatchListFlagChanges = (film) => {
    this.updateDetails(film);
    this.renderMainMenu();
    if (this.#menuSelection === FILTERS.allMovies) {
      this.#moviesPresenter.updateCard(film);
    } else {
      this.#moviesPresenter.removeCardFromFilmsList(film);
    }
  }

  onFavoriteFlagChanges = (film) => {
    this.updateDetails(film);
    this.renderMainMenu();
    if (this.#menuSelection === FILTERS.allMovies) {
      this.#moviesPresenter.updateCard(film);
    } else {
      this.#moviesPresenter.removeCardFromFilmsList(film);
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
        clickAllMoviesHandler: this.renderAllMovies,
        clickWatchListHandler: this.renderWatchList,
        clickHistoryHandler: this.renderHistory,
        clickFavoritesHandler: this.renderFavorites,
        clickStatsHandler: this.renderStats,
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
      this.renderAllMovies();
    } else {
      this.#moviesPresenter.renderDatabaseIsEmpty();
    }

    this.renderFooterStats();
  }
}
