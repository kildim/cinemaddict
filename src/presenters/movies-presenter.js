import {SORT_TYPE} from '../constants';
import MenuSort from '../view/menu-sort';
import {render, replace} from '../utils/render';

export default class MoviesPresenter {
  #cardHandlers = null;
  #menuSort = null;
  #sortSelection = null;
  #container = null;

  constructor(moviesPresenterProps) {
    const {container, cardHandlers} = {...moviesPresenterProps};

    this.#container = container;
    this.#cardHandlers = cardHandlers;
    this.#sortSelection = SORT_TYPE.default;
  }

  renderByDefault = () => {
    // eslint-disable-next-line no-console
    console.log('renderByDefault');

    this.#sortSelection = SORT_TYPE.default;
    this.renderMenuSort();
  }

  renderByDate = () => {
    // eslint-disable-next-line no-console
    console.log('renderByDefault');

    this.#sortSelection = SORT_TYPE.byDate;
    this.renderMenuSort();
  }

  renderByRating = () => {
    // eslint-disable-next-line no-console
    console.log('renderByDate');

    this.#sortSelection = SORT_TYPE.byRating;
    this.renderMenuSort();
  }

  renderMenuSort = () => {
    const MENU_SORT_PROPS = {
      sortSelection: this.#sortSelection,
      menuSortHandlers: {
        clickByDefaultHandler: this.renderByDefault,
        clickByDateHandler: this.renderByDate,
        clickByRatingHandler: this.renderByRating,
      }
    };

    if (this.#menuSort === null) {
      this.#menuSort = new MenuSort(MENU_SORT_PROPS);
      render(this.#container, this.#menuSort);
    } else {
      const newMenuSort = new MenuSort(MENU_SORT_PROPS);
      replace(newMenuSort, this.#menuSort);
      this.#menuSort = newMenuSort;
    }
  }

  renderContent() {
    this.renderMenuSort();
  }
}
