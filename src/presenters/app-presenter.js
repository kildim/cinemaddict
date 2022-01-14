import {render, replace} from '../utils/render';
import UserProfile from '../view/user-profile';
import MainMenu from '../view/main-menu';
import MoviesPresenter from './movies-presenter';
import FooterStatistics from '../view/footer-statistics';
import {FILTERS} from '../constants';
import {Loader} from '../view/loader';
import ContentWrapper from '../view/contentWrapper';

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

  constructor(moviesModel) {
    this.#header = document.querySelector('.header');
    this.#main = document.querySelector('.main');
    this.#footer = document.querySelector('.footer');
    this.#moviesModel = moviesModel;
    this.#menuSelection = FILTERS.allMovies;


    this.#moviesPresenter = new MoviesPresenter();

    this.#moviesModel.addFilmsLoadedObserver(this.onFilmsLoaded);
    this.#moviesModel.addWatchedFlagChangesObserver(this.onWatchedFlagChanges);
  }

  init() {
    this.renderMainMenu();
    this.renderContentWrapper();
    this.renderFooterStats();

    const MOVIES_PRESENTER_PROPS = {
      container: this.#contentWrapper,
      cardHandlers: {
        clickCardHandler: this.renderDetails,
        clickWatchListHandler: this.switchWatchListFlag,
        clickWatchedHandler: this.switchWatchedFlag,
        clickFavoriteHandler: this.switchFavoriteFlag
      },
    };
    this.#moviesPresenter.init(MOVIES_PRESENTER_PROPS);

    this.#isDataLoading = true;
    this.renderLoader();
  }

  renderDetails = (film) => () => {
    // eslint-disable-next-line no-console
    console.log('renderDetails');
  }

  switchWatchListFlag = (film) => () => {
    // eslint-disable-next-line no-console
    console.log('switchWatchListFlag');
  }

  switchWatchedFlag = (film) => () => {
    // eslint-disable-next-line no-console
    console.log('switchWatchedFlag');
  }

  switchFavoriteFlag = (film) => () => {
    // eslint-disable-next-line no-console
    console.log('switchFavoriteFlag');
  }

  renderAllMovies = () => {
    this.#menuSelection = FILTERS.allMovies;
    this.#moviesPresenter.renderFilmsList(this.#moviesModel.films);
    this.renderMainMenu();
  }

  renderWatchList = () => {
    this.#menuSelection = FILTERS.watchlist;
    this.#moviesPresenter.renderFilmsList(this.#moviesModel.watchlist);
    this.renderMainMenu();
  }

  renderHistory = () => {
    this.#menuSelection = FILTERS.history;
    this.#moviesPresenter.renderFilmsList(this.#moviesModel.history);
    this.renderMainMenu();
  }

  renderFavorites = () => {
    this.#menuSelection = FILTERS.favorites;
    this.#moviesPresenter.renderFilmsList(this.#moviesModel.favorites);
    this.renderMainMenu();
  }

  renderStats = () => {
    this.#menuSelection = FILTERS.stats;
    this.renderMainMenu();
  }

  onFilmsLoaded = () => {
    this.#isDataLoading = false;
    this.#contentWrapper.clear();
    this.renderInitContent();
  }

  onWatchedFlagChanges = () => {
    // eslint-disable-next-line no-console
    console.log('onWatchedFlagChanges');
  }

  // renderEmptyListsContent() {
  //   const filmsEmpty = new FilmsEmpty();
  //
  //   filmsEmpty.init(this.#menuSelection);
  //
  //   render(this.#contentWrapper, filmsEmpty);
  // }

  // renderFilms = () => {
  //   switch (this.#menuSelection) {
  //     case FILTERS.allMovies:
  //       this.#filteredFilms = this.#moviesModel.movies;
  //       break;
  //     case FILTERS.favorites:
  //       this.#filteredFilms = this.#moviesModel.favorites;
  //       break;
  //     case FILTERS.history:
  //       this.#filteredFilms = this.#moviesModel.history;
  //       break;
  //     case FILTERS.watchlist:
  //       this.#filteredFilms = this.#moviesModel.watchlist;
  //       break;
  //     default:
  //       throw 'FILMS FILTER NOT SPECIFIED';
  //   }
  //
  //   if (this.#filteredFilms.length > 0) {
  //     // eslint-disable-next-line no-console
  //     console.log(this.#filteredFilms);
  //     this.#moviesPresenter.init(this.#filteredFilms);
  //   } else {
  //     this.renderEmptyListsContent();
  //   }
  // }

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

    this.#moviesPresenter.renderInitContent();
    this.#moviesPresenter.renderFilmsList(this.#moviesModel.films);
    this.#moviesPresenter.renderTopRatedFilms(this.#moviesModel.topRated);
    this.#moviesPresenter.renderMostCommentedFilms(this.#moviesModel.mostCommented);

    this.renderFooterStats();
  }
}
