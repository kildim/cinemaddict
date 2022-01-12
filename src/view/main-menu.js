import AbstractView from './abstract-view';
import {FILTERS} from '../constants';

const getRelevantActiveClass = (isActiveFlag) => {
  if (isActiveFlag === FILTERS.stats) {
    return 'main-navigation__additional--active';
  }
  return isActiveFlag ? 'main-navigation__item--active' : '';
};

const createMainMenuTemplate = (watchInfo, activeMenu) => {
  const {watchList, history, favorites} = watchInfo;
  return (
    `
  <nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item ${getRelevantActiveClass(activeMenu === FILTERS.allMovies)}">All movies</a>
      <a href="#watchlist" class="main-navigation__item ${getRelevantActiveClass(activeMenu === FILTERS.watchlist)}">Watchlist <span class="main-navigation__item-count">${watchList}</span></a>
      <a href="#history" class="main-navigation__item ${getRelevantActiveClass(activeMenu === FILTERS.history)}">History <span class="main-navigation__item-count">${history}</span></a>
      <a href="#favorites" class="main-navigation__item ${getRelevantActiveClass(activeMenu === FILTERS.favorites)}">Favorites <span class="main-navigation__item-count">${favorites}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional ${getRelevantActiveClass(activeMenu === FILTERS.stats)}">Stats</a>
  </nav>
`
  ) ;
};

// const genProceedMenuHandler = (activeMenu, handler) => (event) => {
//   event.preventDefault();
//   handler(activeMenu);
// };

export default class MainMenu extends AbstractView{
  #watchInfo = null;
  #activeMenu = null;

  constructor(mainMenuProps) {
    const {watchInfo, activeMenu, mainMenuHandlers} = {...mainMenuProps};
    super();
    this.#watchInfo = watchInfo;
    this.#activeMenu = activeMenu;

    this._externalHandlers.clickAllMovies = mainMenuHandlers.clickAllMoviesHandler;
    this._externalHandlers.clickWatchList = mainMenuHandlers.clickWatchListHandler;
    this._externalHandlers.clickHistory = mainMenuHandlers.clickHistoryHandler;
    this._externalHandlers.clickFavorites = mainMenuHandlers.clickFavoritesHandler;
    this._externalHandlers.clickStats = mainMenuHandlers.clickStatsHandler;

    const [allMovies, watchlist, history, favorites, stats] = this.element.querySelectorAll('a');

    allMovies.addEventListener('click', this.#clickAllMovies);
    watchlist.addEventListener('click', this.#clickWatchList);
    history.addEventListener('click', this.#clickHistory);
    favorites.addEventListener('click', this.#clickFavorites);
    stats.addEventListener('click', this.#clickStats);
  }

  #clickAllMovies = (event) => {
    event.preventDefault();
    this._externalHandlers.clickAllMovies();
  }

  #clickWatchList = (event) => {
    event.preventDefault();
    this._externalHandlers.clickWatchList();
  }

  #clickHistory = (event) => {
    event.preventDefault();
    this._externalHandlers.clickHistory();
  }

  #clickFavorites = (event) => {
    event.preventDefault();
    this._externalHandlers.clickFavorites();
  }

  #clickStats = (event) => {
    event.preventDefault();
    this._externalHandlers.clickStats();
  }

  get template() {
    return createMainMenuTemplate(this.#watchInfo, this.#activeMenu);
  }
}
