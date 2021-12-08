import {createElement} from '../render';

const createFilmsTemplate = () => `
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">
      </div>
    </section>
`;

export default class AllMoviesContainer {
  #element = null;

  getContainer = () => this.element.querySelector('.films-list__container');

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmsTemplate();
  }

  removeElement() {
    this.#element.remove();
  }
}
