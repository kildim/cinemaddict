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

const genProceedMenuHandler = (activeMenu, handler) => (event) => {
  event.preventDefault();
  handler(activeMenu);
};

export default class MainMenu extends AbstractView{
  #watchInfo = null;
  #activeMenu = null;

  constructor(watchInfo, activeMenu) {
    super();
    this.#watchInfo = watchInfo;
    this.#activeMenu = activeMenu;
  }

  setExternalHandlers = (externalHandler) => {
    const [allMovies, watchlist, history, favorites, stats] = this.element.querySelectorAll('a');

    allMovies.addEventListener('click', genProceedMenuHandler(FILTERS.allMovies, externalHandler));
    watchlist.addEventListener('click', genProceedMenuHandler(FILTERS.watchlist, externalHandler));
    history.addEventListener('click', genProceedMenuHandler(FILTERS.history, externalHandler));
    favorites.addEventListener('click', genProceedMenuHandler(FILTERS.favorites, externalHandler));
    stats.addEventListener('click', genProceedMenuHandler(FILTERS.stats, externalHandler));
  }

  get template() {
    return createMainMenuTemplate(this.#watchInfo, this.#activeMenu);
  }
}
