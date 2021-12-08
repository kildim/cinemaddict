import {createElement} from '../render';

const createExtrasContainerTemplate = (title) => `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">${title}</h2>
      <div class="films-list__container">
      </div>
    </section>
`;

export default class ExtrasContainer {
  #element = null;
  #title = null;

  constructor(title) {
    this.#title = title;
  }

  getContainer = () => this.element.querySelector('.films-list__container');

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createExtrasContainerTemplate(this.#title);
  }

  removeElement() {
    this.#element.remove();
  }
}
