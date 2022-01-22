import AbstractObservable from './abstract-observable';
import {parseFromServerFormat, parseToServerFormat} from '../utils/adapters';
import {range} from '../utils/range';

export const OBSERVER_TYPE = {
  filmsLoaded: 'filmsLoaded',
  watchedFlagChanges: 'watchedFlagChanges',
  watchlistFlagChanges: 'watchlistFlagChanges',
  favoriteFlagChanges: 'favoriteFlagChanges',
};

const RANK = {
  'novice': range(1, 9),
  'fan': range(10, 19),
  'movie buff': range(20, Infinity),
};

export default class MoviesModel {
  #films = null;
  #dataProvider = null;
  #spotters = {};

  constructor(dataProvider) {
    this.#dataProvider = dataProvider;
    this.#films = [];
    this.#spotters = {
      [OBSERVER_TYPE.filmsLoaded]: new AbstractObservable(),
      [OBSERVER_TYPE.watchedFlagChanges]: new AbstractObservable(),
      [OBSERVER_TYPE.watchlistFlagChanges]: new AbstractObservable(),
      [OBSERVER_TYPE.favoriteFlagChanges]: new AbstractObservable(),
    };
  }

  addObserver(params) {
    const {observerType, observer} = {...params};
    this.#spotters[observerType].addObserver(observer);
  }

  removeObserver(params) {
    const {spotterType, observer} = {...params};
    this.spotters[spotterType].removeObserver(observer);
  }

  get watchInfo() {
    const watchInfo = {
      watchlist: 0,
      history: 0,
      favorites: 0,
    };
    this.#films.forEach((film) => {
      if (film.watchlist) {watchInfo.watchlist++;}
      if (film.watched) {watchInfo.history++;}
      if (film.favorite) {watchInfo.favorites++;}
    });

    return watchInfo;
  }

  get filmsCount() {
    return this.#films.length;
  }

  get films() {
    return [...this.#films];
  }

  loadMovies() {
    this.#dataProvider.loadFilms().then((films) => {
      this.#films = films.map((film) => parseFromServerFormat(film));
      this.#spotters[OBSERVER_TYPE.filmsLoaded]._notify();
    });
  }

  addComment(params) {
    const {filmId, comment, addCommentCB, addCommentFailCB} = {...params};
    this.#dataProvider.addComment({filmId, comment}).then(() => addCommentCB()).catch((error) => addCommentFailCB(error));
  }

  deleteComment(params) {
    const {commentId, deleteCommentCB} = { ...params};
    this.#dataProvider.deleteComment(commentId).then(() => deleteCommentCB());
  }

  loadComments(params) {
    const {filmId, loadCommentsCB} = {...params};
    this.#dataProvider.loadComments(filmId).then((comments) => loadCommentsCB(comments));
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
      this.#spotters[OBSERVER_TYPE.watchedFlagChanges]._notify(updatedFilm);
    });
  }

  changeWatchedListFlag = (film) => {
    const changedFilm = parseToServerFormat({...film, watchlist: !film.watchlist});
    this.#dataProvider.updateFilm(changedFilm).then((movie) => {
      const updatedFilm = parseFromServerFormat(movie);
      this.replaceFilm(updatedFilm);
      this.#spotters[OBSERVER_TYPE.watchlistFlagChanges]._notify(updatedFilm);
    });
  }

  changeFavoriteFlag = (film) => {
    const changedFilm = parseToServerFormat({...film, favorite: !film.favorite});
    this.#dataProvider.updateFilm(changedFilm).then((movie) => {
      const updatedFilm = parseFromServerFormat(movie);
      this.replaceFilm(updatedFilm);
      this.#spotters[OBSERVER_TYPE.favoriteFlagChanges]._notify(updatedFilm);
    });
  }

  get topRated() {
    const films = [...this.#films];
    return films.sort((filmPred, filmSucc) => filmSucc.totalRating - filmPred.totalRating);
  }

  get mostCommented() {
    const films = [...this.#films];
    return films.sort((filmPred, filmSucc) => filmSucc.comments.length - filmPred.comments.length);
  }

  get history() {
    return this.#films.filter((film) => film.watched);
  }

  get watchlist() {
    return this.#films.filter((film) => film.watchlist);
  }

  get favorites() {
    return this.#films.filter((film) => film.favorite);
  }

  getWatched(period) {
    return this.#films.filter((film) => period(film.watchingDate));
  }

  get userRank() {
    const watchedCount = this.history.length;

    for (const key in RANK) {
      if (RANK[key](watchedCount)) {return key;}
    }
    return '';
  }
}
