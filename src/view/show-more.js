import AbstractView from './abstract-view';

const createShowMoreTemplate = () => `
  <button class="films-list__show-more">Show more</button>
`;

export default class ShowMore extends AbstractView{

  constructor(showMoreProps) {
    const {showMoreHandlers} = {...showMoreProps};
    super();
    this._externalHandlers.clickMore = showMoreHandlers.clickMore;

    this.element.addEventListener('click', this.#clickMoreHandler);
  }

  #clickMoreHandler = (event) => {
    event.preventDefault();
    this._externalHandlers.clickMore();
  }

  get template() {
    return createShowMoreTemplate();
  }

  removeElement() {
    this.element.removeEventListener('click', this.#clickMoreHandler);
    super.removeElement();
  }
}
