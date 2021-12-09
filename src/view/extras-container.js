import AbstractView from './abstract-view';

const createExtrasContainerTemplate = (title) => `
    <section class="films-list films-list--extra">
      <h2 class="films-list__title">${title}</h2>
      <div class="films-list__container">
      </div>
    </section>
`;

export default class ExtrasContainer extends AbstractView{
  #title = null;

  constructor(title) {
    super();
    this.#title = title;
  }

  getContainer = () => this.element.querySelector('.films-list__container');

  get template() {
    return createExtrasContainerTemplate(this.#title);
  }
}
