import {createElement} from '../utils/render';

const createFooterStatisticsTemplate = (count) => `
    <section class="footer__statistics">
      <p>${count} movies inside</p>
    </section>
`;

export default class FooterStatistics {
  #element = null;
  #count = null;

  constructor(count) {
    this.#count = count;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFooterStatisticsTemplate(this.#count);
  }

  removeElement() {
    this.#element.remove();
  }
}
