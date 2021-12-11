import AbstractView from './abstract-view';

const createShowMoreTemplate = () => `
  <button class="films-list__show-more">Show more</button>
`;

export default class ShowMore extends AbstractView{

  #clickMoreHandler = (event) => {
    event.preventDefault();
    this._externalHandlers.clickMore();
  }

  setExternalHandlers = ({clickMore = null}) => {
    this._externalHandlers.clickMore = clickMore;

    this.element.addEventListener('click', this.#clickMoreHandler);
  }

  get template() {
    return createShowMoreTemplate();
  }

  removeElement() {
    this.element.removeEventListener('click', this.#clickMoreHandler);
    super.removeElement();
  }
}
