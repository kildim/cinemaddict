import AbstractView from './abstract-view';
import {SORT_TYPE} from '../constants';

const createSortTemplate = () => `
  <ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>
`;

const genProceedSortHandler = (sortType, handler) => (event) => {
  event.preventDefault();
  handler(sortType);
};

export default class Sort extends AbstractView{

  setExternalHandlers = (externalHandler) => {
    const [byDefault, byDate, byRating] = this.element.querySelectorAll('.sort__button');

    byDefault.addEventListener('click', genProceedSortHandler(SORT_TYPE.default, externalHandler));
    byDate.addEventListener('click', genProceedSortHandler(SORT_TYPE.byDate, externalHandler));
    byRating.addEventListener('click', genProceedSortHandler(SORT_TYPE.byRating, externalHandler));
  }

  get template() {
    return createSortTemplate();
  }
}
