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

const genProceedSortHandler = (sortType, handler) => (event) => {
  event.preventDefault();
  handler(sortType);
};

export default class Sort extends AbstractView{
  #sortType = null;

  constructor(sortType) {
    super();
    this.#sortType = sortType;
  }

  setExternalHandlers = (externalHandler) => {
    const [byDefault, byDate, byRating] = this.element.querySelectorAll('.sort__button');

    byDefault.addEventListener('click', genProceedSortHandler(SORT_TYPE.default, externalHandler));
    byDate.addEventListener('click', genProceedSortHandler(SORT_TYPE.byDate, externalHandler));
    byRating.addEventListener('click', genProceedSortHandler(SORT_TYPE.byRating, externalHandler));
  }

  get template() {
    return createSortTemplate(this.#sortType);
  }
}
