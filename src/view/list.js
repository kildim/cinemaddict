import {createElement} from '../render';

const createListTemplate = () => (
  `
    <div class="films-list__container">
    </div>
    `
);

export default class List {
    #element = null;

    get element() {
      if (!this.#element) {
        this.#element = createElement(this.template);
      }

      return this.#element;
    }

    get template() {
      return createListTemplate();
    }

    removeElement() {
      this.#element.remove();
    }
}
