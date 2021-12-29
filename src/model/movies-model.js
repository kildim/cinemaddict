import AbstractObservable from './abstract-observable';
import {getFilms} from '../data/data-adapter';

export default class MoviesModel extends AbstractObservable {
  #films = null;

  constructor() {
    super();
    this.#films = this.films;
  }

  get watchInfo() {
    const watchInfo = {
      watchList: 0,
      history: 0,
      favorites: 0,
    };
    this.#films.forEach((film) => {
      if (film.watchList) {watchInfo.watchList++;}
      if (film.watched) {watchInfo.history++;}
      if (film.favorite) {watchInfo.favorites++;}
    });

    return watchInfo;
  }

  get films() {
    if (this.#films === null) {
      this.#films = getFilms;
    }
    return [...this.#films];
  }

  set films(films) {
    this.#films = [...films];
  }

  updateFilm() {

  }
}
