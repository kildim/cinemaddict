import AbstractView from './abstract-view';

const createMoviesContainerTemplate = (title, visibilityClass, extrasClass) => `
    <section class="films-list ${extrasClass}">
      <h2 class="films-list__title ${visibilityClass}">${title}</h2>
      <div class="films-list__container">
      </div>
    </section>
`;

export default class MoviesContainer extends AbstractView {
  #title = null;
  #isExtras = null;
  #cardsContainer = null;

  constructor(title, isExtras = true) {
    super();
    this.#title = title;
    this.#isExtras = isExtras;
  }

  get cardsContainer() {
    if (!this.#cardsContainer) {
      this.#cardsContainer = this.element.querySelector('.films-list__container');
    }

    return this.#cardsContainer;
  }

  get template() {
    const visibilityClass = this.#isExtras ? '' : 'visually-hidden';
    const extrasClass = this.#isExtras ? 'films-list--extra' : '';
    return createMoviesContainerTemplate(this.#title, visibilityClass, extrasClass);
  }
}
