import {FILTERS} from '../constants';
import AbstractView from './abstract-view';

const message =
  {
    [FILTERS.allMovies]: 'There are no movies in our database',
    [FILTERS.watchlist]: 'There are no movies to watch now',
    [FILTERS.history]: 'There are no watched movies now',
    [FILTERS.favorites]: 'There are no favorite movies now'
  };

const createFilmsEmptyTemplate = (filter) => (
  `
  <section className="films-list">
    <h2 className="films-list__title">${message[filter]}</h2>
  </section>
  `
);

export default class FilmsEmpty extends AbstractView{
  #filter = null;

  init = (filter) => {
    this.removeElement();
    this.#filter = filter;
  }

  get template() {
    return createFilmsEmptyTemplate(this.#filter);
  }
}
