import {removeChildren, render, replace} from '../utils/render';
import UserProfile from '../view/user-profile';
import MainMenu from '../view/main-menu';
import MoviesPresenter from './movies-presenter';
import FooterStatistics from '../view/footer-statistics';
import FilmsEmpty from '../view/films-empty';
import {FILTERS, SORT_TYPE} from '../constants';
import ListsContainer from '../view/lists-container';
import {Loader} from '../view/loader';

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
  #loader = null;
  #filteredFilms = null;
  #moviesPresenter = null;

  constructor(moviesModel) {
    this.#header = document.querySelector('.header');
    this.#main = document.querySelector('.main');
    this.#footer = document.querySelector('.footer');
    this.#moviesModel = moviesModel;
    this.#isDataLoading = true;
    this.#menuSelection = FILTERS.allMovies;

    // this.#moviesPresenter = new MoviesPresenter(this.#main, this.#moviesModel);
    const MOVIES_PRESENTER_PROPS = {
      container: this.#main,
      cardHandlers: {}
    };
    this.#moviesPresenter = new MoviesPresenter(MOVIES_PRESENTER_PROPS);

    this.#moviesModel.addFilmsChangesObserver(this.onFilmsLoaded);

    // this.#moviesModel.addWatchInfoChangesObserver(this.renderMainMenu);
    this.#moviesModel.addWatchedFlagChangesObserver(this.onWatchedFlagChanges);
  }

  renderAllMovies = () => {
    // eslint-disable-next-line no-console
    console.log('renderAllMovies');

    this.#menuSelection = FILTERS.allMovies;
    this.renderMainMenu();
  }

  renderWatchList = () => {
    // eslint-disable-next-line no-console
    console.log('renderWatchList');

    this.#menuSelection = FILTERS.watchlist;
    this.renderMainMenu();
  }

  renderHistory = () => {
    // eslint-disable-next-line no-console
    console.log('renderHistory');

    this.#menuSelection = FILTERS.history;
    this.renderMainMenu();
  }

  renderFavorites = () => {
    // eslint-disable-next-line no-console
    console.log('renderFavorites');

    this.#menuSelection = FILTERS.favorites;
    this.renderMainMenu();
  }

  renderStats = () => {
    // eslint-disable-next-line no-console
    console.log('renderStats');

    this.#menuSelection = FILTERS.stats;
    this.renderMainMenu();
  }

  onFilmsLoaded = () => {
    this.#isDataLoading = false;
    if (this.#loader !== null) {
      this.#loader.removeElement();
      this.#loader = null;
    }
    this.renderContent();
  }

  onWatchedFlagChanges = () => {
    this.renderContent();
    // this.renderProfile();
    // this.renderMainMenu();
  }

  renderMainMenuSelectedContent = (mainMenuSelection) => {
    this.#isDataLoading = false;
    removeChildren(this.#main);
    this.#mainMenu = null;

    this.#menuSelection = mainMenuSelection;
    this.renderMainMenu();

    if (this.#menuSelection === FILTERS.stats) {
      // eslint-disable-next-line no-console
      console.log('RENDER STATS');
    } else {
      this.renderFilms();
    }

  }

  renderEmptyListsContent() {
    const filmsEmpty = new FilmsEmpty();

    filmsEmpty.init(this.#menuSelection);
    const listsContainer = new ListsContainer();

    render(this.#main, listsContainer);
    render(listsContainer, filmsEmpty);
  }

  renderFilms = () => {
    switch (this.#menuSelection) {
      case FILTERS.allMovies:
        this.#filteredFilms = this.#moviesModel.movies;
        break;
      case FILTERS.favorites:
        this.#filteredFilms = this.#moviesModel.favorites;
        break;
      case FILTERS.history:
        this.#filteredFilms = this.#moviesModel.history;
        break;
      case FILTERS.watchlist:
        this.#filteredFilms = this.#moviesModel.watchlist;
        break;
      default:
        throw 'FILMS FILTER NOT SPECIFIED';
    }

    if (this.#filteredFilms.length > 0) {
      // eslint-disable-next-line no-console
      console.log(this.#filteredFilms);
      this.#moviesPresenter.init(this.#filteredFilms);
    } else {
      this.renderEmptyListsContent();
    }
  }

  renderLoader = () => {
    render(this.#main, new Loader());
  }

  renderLoader = () => {
    if (this.#loader === null) {
      this.#loader = new Loader();
      render(this.#main, this.#loader);
    } else {
      const newLoader = new Loader();
      replace(newLoader, this.#loader);
      this.#loader = newLoader;
    }
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

  get userRank() {
    let rank = '';
    const watchedCount = this.#moviesModel.history.length;
    if (watchedCount > 20) {
      rank = 'movie buff';
    } else {
      if (watchedCount > 10) {
        rank = 'fan';
      } else {
        if (watchedCount > 0) {
          rank = 'novice';
        }
      }
    }
    return(rank);
  }

  renderProfile = () => {
    const newProfile = new UserProfile(this.userRank);
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

  renderContent = () => {
    if (this.#isDataLoading) {
      this.renderMainMenu();
      this.renderLoader();
      this.renderFooterStats();
    } else {
      switch (this.#menuSelection) {
        case FILTERS.allMovies:
          this.renderProfile();
          this.renderMainMenu();
          this.#moviesPresenter.renderContent();
          this.renderFooterStats();
          break;
      }
    }
  }
}
