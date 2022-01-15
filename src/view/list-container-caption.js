import AbstractView from './abstract-view';

const createListContainerCaptionTemplate = (message, visibility) => (
  `
    <h2 class="films-list__title ${visibility ? '' : 'visually-hidden'}">${message}</h2>
  `
);

export default class ListContainerCaption extends AbstractView{
  #message = null;
  #visibility = null;

  constructor(message, visibility = false) {
    super();
    this.#message = message;
    this.#visibility = visibility;
  }

  get template() {
    return createListContainerCaptionTemplate(this.#message, this.#visibility);
  }
}
