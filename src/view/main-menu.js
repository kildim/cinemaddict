import AbstractView from './abstract-view';
import {Filters} from '../constants';

const getRelevantActiveClass = (isActiveFlag) => {
  if (isActiveFlag === Filters.STATS) {
    return 'main-navigation__additional--active';
  }
  return isActiveFlag ? 'main-navigation__item--active' : '';
};

const createMainMenuTemplate = (watchInfo, activeMenu) => {
  const {watchlist, history, favorites} = watchInfo;
  return (
    `
  <nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item ${getRelevantActiveClass(activeMenu === Filters.ALL_MOVES)}">All movies</a>
      <a href="#watchlist" class="main-navigation__item ${getRelevantActiveClass(activeMenu === Filters.WATCHLIST)}">Watchlist <span class="main-navigation__item-count">${watchlist}</span></a>
      <a href="#history" class="main-navigation__item ${getRelevantActiveClass(activeMenu === Filters.HISTORY)}">History <span class="main-navigation__item-count">${history}</span></a>
      <a href="#favorites" class="main-navigation__item ${getRelevantActiveClass(activeMenu === Filters.FAVORITES)}">Favorites <span class="main-navigation__item-count">${favorites}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional ${getRelevantActiveClass(activeMenu === Filters.STATS)}">Stats</a>
  </nav>
`
  ) ;
};

export default class MainMenu extends AbstractView{
  #watchInfo = null;
  #activeMenu = null;

  constructor(mainMenuProps) {
    const {watchInfo, activeMenu, mainMenuHandlers} = {...mainMenuProps};
    super();
    this.#watchInfo = watchInfo;
    this.#activeMenu = activeMenu;

    this._externalHandlers.allMoviesClickHandler = mainMenuHandlers.allMoviesClickHandler;
    this._externalHandlers.watchListClickHandler = mainMenuHandlers.watchListClickHandler;
    this._externalHandlers.historyClickHandler = mainMenuHandlers.historyClickHandler;
    this._externalHandlers.favoritesClickHandler = mainMenuHandlers.favoritesClickHandler;
    this._externalHandlers.statsClickHandler = mainMenuHandlers.statsClickHandler;

    const [allMovies, watchlist, history, favorites, stats] = this.element.querySelectorAll('a');

    allMovies.addEventListener('click', this.#allMoviesClickHandler);
    watchlist.addEventListener('click', this.#watchListClickHandler);
    history.addEventListener('click', this.#historyClickHandler);
    favorites.addEventListener('click', this.#favoritesClickHandler);
    stats.addEventListener('click', this.#statsClickHandler);
  }

  #allMoviesClickHandler = (event) => {
    event.preventDefault();
    this._externalHandlers.allMoviesClickHandler();
  }

  #watchListClickHandler = (event) => {
    event.preventDefault();
    this._externalHandlers.watchListClickHandler();
  }

  #historyClickHandler = (event) => {
    event.preventDefault();
    this._externalHandlers.historyClickHandler();
  }

  #favoritesClickHandler = (event) => {
    event.preventDefault();
    this._externalHandlers.favoritesClickHandler();
  }

  #statsClickHandler = (event) => {
    event.preventDefault();
    this._externalHandlers.statsClickHandler();
  }

  get template() {
    return createMainMenuTemplate(this.#watchInfo, this.#activeMenu);
  }
}
