import AbstractView from './abstract-view';
import {SORT_TYPE} from '../constants';

const getRelevantActiveClass = (isActiveFlag) => isActiveFlag ? 'sort__button--active' : '';

const createSortTemplate = (sortType) => `
  <ul class="sort">
    <li><a href="#" class="sort__button ${getRelevantActiveClass(sortType === SORT_TYPE.default)}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${getRelevantActiveClass(sortType === SORT_TYPE.byDate)}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${getRelevantActiveClass(sortType === SORT_TYPE.byRating)}">Sort by rating</a></li>
  </ul>
`;

export default class MenuSort extends AbstractView{
  #sortType = null;

  constructor(menuSortProps) {
    const {sortSelection, menuSortHandlers} = {...menuSortProps};
    super();
    this.#sortType = sortSelection;

    const [byDefault, byDate, byRating] = this.element.querySelectorAll('.sort__button');
    byDefault.addEventListener('click', menuSortHandlers.clickByDefaultHandler);
    byDate.addEventListener('click', menuSortHandlers.clickByDateHandler);
    byRating.addEventListener('click', menuSortHandlers.clickByRatingHandler);
  }

  get template() {
    return createSortTemplate(this.#sortType);
  }
}
