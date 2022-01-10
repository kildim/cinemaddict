import AbstractObservable from './abstract-observable';
import {parseFromServerFormat, parseToServerFormat} from '../utils/adapters';

export default class MoviesModel {
  #films = null;
  #dataProvider = null;
  #watchInfoChangesSpotters = null;
  #filmsChangesSpotters = null;
  #watchedFlagChangesSpotters = null;

  constructor(dataProvider) {
    this.#films = [];
    this.#dataProvider = dataProvider;
    this.#watchInfoChangesSpotters = new AbstractObservable();
    this.#filmsChangesSpotters = new AbstractObservable();
    this.#watchedFlagChangesSpotters = new AbstractObservable();
  }

  addWatchedFlagChangesObserver(observer) {
    this.#watchedFlagChangesSpotters.addObserver(observer);
  }

  removeWatchedFlagChangesObserver(observer) {
    this.#watchInfoChangesSpotters.removeObserver(observer);
  }

  addWatchInfoChangesObserver(observer) {
    this.#watchInfoChangesSpotters.addObserver(observer);
  }

  removeWatchInfoChangesObserver(observer) {
    this.#watchInfoChangesSpotters.removeObserver(observer);
  }

  addFilmsChangesObserver(observer) {
    this.#filmsChangesSpotters.addObserver(observer);
  }

  removeFilmsChangesObserver(observer) {
    this.#filmsChangesSpotters.removeObserver(observer);
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

  get filmsCount() {
    return this.#films.length;
  }

  get movies() {
    return [...this.#films];
  }

  loadMovies() {
    this.#dataProvider.loadFilms().then((films) => {
      this.#films = films.map((film) => parseFromServerFormat(film));
      this.#filmsChangesSpotters._notify();
    });
  }

  replaceFilm(film) {
    const index = this.#films.findIndex((movie) => movie.id === film.id);
    this.#films[index] = {...film};
  }

  changeFilmsWatchedFlag = (film) => {
    const changedFilm = parseToServerFormat({...film, watched: !film.watched});
    // eslint-disable-next-line no-console
    console.log(changedFilm);
    this.#dataProvider.updateFilm(changedFilm).then((movie) => {
      const updatedFilm = parseFromServerFormat(movie);
      this.replaceFilm(updatedFilm);
      this.#watchedFlagChangesSpotters._notify(updatedFilm);
    });
  }

  get topRated() {
    return this.#films.sort((filmPred, filmSucc) => filmSucc.totalRating - filmPred.totalRating);
  }

  get mostCommented() {
    return this.#films.sort((filmPred, filmSucc) => filmSucc.comments.length - filmPred.comments.length);
  }

  get history() {
    return this.#films.filter((film) => film.watched);
  }

  get watchlist() {
    return this.#films.filter((film) => film.watchList);
  }

  get favorites() {
    return this.#films.filter((film) => film.favorite);
  }

  // set films(films) {
  //   this.#films = [...films];
  // }
  //
  // updateFilm(id, payload) {
  //   const film = {...this.films.find((movie) => movie.id === id), ...payload};
  //   updateFilm(film, this._filmUpdated);
  // }
  //
  // _filmUpdated = (film) => {
  //   this.watchInfoChangesObserver._notify(film);
  // }
}
