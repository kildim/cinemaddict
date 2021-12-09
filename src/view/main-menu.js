import {createElement} from '../utils/render';

const createMainMenuTemplate = (watchInfo) => {
  const {watchList, history, favorites} = watchInfo;
  return (
    `
  <nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchList}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${history}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorites}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>
`
  ) ;
};

export default class MainMenu {
  #element = null;
  #watchInfo = null;

  constructor(watchInfo) {
    this.#watchInfo = watchInfo;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createMainMenuTemplate(this.#watchInfo);
  }

  removeElement() {
    this.#element.remove();
  }
}
