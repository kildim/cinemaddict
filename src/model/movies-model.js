import AbstractObservable from './abstract-observable';
import {parseFromServerFormat} from '../utils/adapters';

export default class MoviesModel {
  #films = null;
  #dataProvider = null;
  #watchInfoChangesSpotters = null;
  #filmsChangesSpotters = null;

  constructor(dataProvider) {
    this.#films = [];
    this.#dataProvider = dataProvider;
    this.#watchInfoChangesSpotters = new AbstractObservable();
    this.#filmsChangesSpotters = new AbstractObservable();
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

  // loadMovies = async () => {
  //   try {
  //     const films = await this.#dataProvider.loadFilms();
  //     // eslint-disable-next-line no-console
  //     console.log(films);
  //     this.#filmsChangesSpotters._notify();
  //   } catch (error) {
  //     this.#films = [];
  //   }
  // }

  loadMovies() {
    this.#dataProvider.loadFilms().then((films) => {
      this.#films = films.map((film) => parseFromServerFormat(film));
      this.#filmsChangesSpotters._notify();
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
