import {createElement} from '../utils/render';

const createListsContainerTemplate = () => `
  <section class="films">
  </section>
`;

export default class ListsContainer {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createListsContainerTemplate();
  }

  removeElement() {
    this.#element.remove();
  }
}
