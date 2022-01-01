import AbstractObservable from './abstract-observable';
import {changeFilm, getFilms} from '../data/data-adapter';

export default class MoviesModel {
  #films = null;
  watchInfoObserver = null;

  constructor() {
    this.#films = this.films;
    this.watchInfoObserver = new AbstractObservable();
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

  get topRated() {
    return this.films.sort((filmPred, filmSucc) => filmSucc.totalRating - filmPred.totalRating);
  }

  get mostCommented() {
    return this.films.sort((filmPred, filmSucc) => filmSucc.comments.length - filmPred.comments.length);
  }

  get history() {
    return this.films.filter((film) => film.watched);
  }

  get watchlist() {
    return this.films.filter((film) => film.watchList);
  }

  get favorites() {
    return this.films.filter((film) => film.favorite);
  }

  set films(films) {
    this.#films = [...films];
  }

  updateFilm(id, payload) {
    const film = {...this.films.find((movie) => movie.id === id), ...payload};
    changeFilm(film, this._filmUpdated);
  }

  _filmUpdated = (film) => {
    this.watchInfoObserver._notify(film);
  }
}
