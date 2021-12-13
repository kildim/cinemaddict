import {formatTime} from '../utils/date-time';
import AbstractView from './abstract-view';

const createCardTemplate = (film) => {
  const {title, totalRating, releaseDate, runtime, poster, genres, description, comments, watchList, watched, favorite} = film;
  const releaseYear = new Date(releaseDate).getFullYear();
  const MAX_DESCRIPTION_LENGTH = 139;

  const getRelevantActiveClass = (isActiveFlag) => isActiveFlag ? 'film-card__controls-item--active' : '';
  const truncateDescription = (text) => text.length > MAX_DESCRIPTION_LENGTH ? `
  ${description.slice(0, MAX_DESCRIPTION_LENGTH)}...` : description;

  return (
    `
        <article class="film-card">
          <a class="film-card__link">
            <h3 class="film-card__title">${title}</h3>
            <p class="film-card__rating">${totalRating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${releaseYear}</span>
              <span class="film-card__duration">${formatTime(runtime)}</span>
              <span class="film-card__genre">${genres[0]}</span>
            </p>
            <img src="${poster}" alt="${title} poster" class="film-card__poster">
            <p class="film-card__description">${truncateDescription(description)}</p>
            <span class="film-card__comments">${comments.length} comments</span>
          </a>
          <div class="film-card__controls">
            <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${getRelevantActiveClass(watchList)}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${getRelevantActiveClass(watched)}" type="button">Mark as watched</button>
            <button class="film-card__controls-item film-card__controls-item--favorite ${getRelevantActiveClass(favorite)}" type="button">Mark as favorite</button>
          </div>
        </article>
`
  );
};

export default class Card extends AbstractView {
  #film = null;

  constructor(film) {
    super();
    this.#film = film;
  }

  #clickCardHandler = (event) => {
    event.preventDefault();
    this._externalHandlers.clickCard(this.#film);
  }

  #clickWatchList = (event) => {
    event.preventDefault();
    this._externalHandlers.clickWatchList(this.#film);
  }

  #clickWatched = (event) => {
    event.preventDefault();
    this._externalHandlers.clickWatched(this.#film);
  }

  #clickFavorite = (event) => {
    event.preventDefault();
    this._externalHandlers.clickFavorite(this.#film);
  }

  setExternalHandlers = (externalHandlers) => {
    this._externalHandlers.clickCard = externalHandlers.clickCardHandler(this.#film);
    this._externalHandlers.clickWatchList = externalHandlers.clickWatchListHandler(this.#film);
    this._externalHandlers.clickWatched = externalHandlers.clickWatchedHandler(this.#film);
    this._externalHandlers.clickFavorite = externalHandlers.clickFavoriteHandler(this.#film);

    const closeButton = this.element.querySelector('.film-card__link');
    const watchListButton = this.element.querySelector('.film-card__controls-item--add-to-watchlist');
    const watchedButton = this.element.querySelector('.film-card__controls-item--mark-as-watched');
    const favoriteButton = this.element.querySelector('.film-card__controls-item--favorite');

    closeButton.addEventListener('click', this.#clickCardHandler);
    watchListButton.addEventListener('click', this.#clickWatchList);
    watchedButton.addEventListener('click', this.#clickWatched);
    favoriteButton.addEventListener('click', this.#clickFavorite);
  }

  get id() {
    return this.#film.id;
  }

  get filmDate() {
    return this.#film.releaseDate;
  }

  get watchList() {
    return this.#film.watchlist;
  }

  get template() {
    return createCardTemplate(this.#film);
  }
}
