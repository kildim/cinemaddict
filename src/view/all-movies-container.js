import AbstractView from './abstract-view';

const createFilmsTemplate = () => `
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">
      </div>
    </section>
`;

export default class AllMoviesContainer extends AbstractView {

  getContainer = () => this.element.querySelector('.films-list__container');

  get template() {
    return createFilmsTemplate();
  }
}
