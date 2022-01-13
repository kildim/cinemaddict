import AbstractObservable from './abstract-observable';
import {parseFromServerFormat, parseToServerFormat} from '../utils/adapters';

export default class MoviesModel {
  #films = null;
  #dataProvider = null;
  #watchInfoChangesSpotters = null;
  #filmsLoadedSpotters = null;
  #watchedFlagChangesSpotters = null;

  constructor(dataProvider) {
    this.#dataProvider = dataProvider;
    this.#films = [];
    this.#watchInfoChangesSpotters = new AbstractObservable();
    this.#filmsLoadedSpotters = new AbstractObservable();
    this.#watchedFlagChangesSpotters = new AbstractObservable();
  }

  addWatchedFlagChangesObserver(observer) {
    this.#watchedFlagChangesSpotters.addObserver(observer);
  }

  removeWatchedFlagChangesObserver(observer) {
    this.#watchInfoChangesSpotters.removeObserver(observer);
  }

  // addWatchInfoChangesObserver(observer) {
  //   this.#watchInfoChangesSpotters.addObserver(observer);
  // }
  //
  // removeWatchInfoChangesObserver(observer) {
  //   this.#watchInfoChangesSpotters.removeObserver(observer);
  // }

  addFilmsLoadedObserver(observer) {
    this.#filmsLoadedSpotters.addObserver(observer);
  }

  removeFilmsLoadedObserver(observer) {
    this.#filmsLoadedSpotters.removeObserver(observer);
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
    return this.#films;
  }

  loadMovies() {
    this.#dataProvider.loadFilms().then((films) => {
      this.#films = films.map((film) => parseFromServerFormat(film));
      this.#filmsLoadedSpotters._notify();
    });
  }

  replaceFilm(film) {
    const index = this.#films.findIndex((movie) => movie.id === film.id);
    this.#films[index] = {...film};
  }

  changeFilmsWatchedFlag = (film) => {
    const changedFilm = parseToServerFormat({...film, watched: !film.watched});
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

  get userRank() {
    let rank = '';
    const watchedCount = this.history.length;
    if (watchedCount > 20) {
      rank = 'movie buff';
    } else {
      if (watchedCount > 10) {
        rank = 'fan';
      } else {
        if (watchedCount > 0) {
          rank = 'novice';
        }
      }
    }
    return (rank);
  }
}
