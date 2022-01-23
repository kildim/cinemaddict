import AbstractView from './abstract-view';
import {formatTime} from '../utils/date-time';

const createCardTemplate = (film) => {
  const {title, totalRating, releaseDate, runtime, poster, genres, description, comments, watchlist, watched, favorite} = film;
  const releaseYear = releaseDate.getFullYear();
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
            <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${getRelevantActiveClass(watchlist)}" type="button">Add to watchlist</button>
            <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${getRelevantActiveClass(watched)}" type="button">Mark as watched</button>
            <button class="film-card__controls-item film-card__controls-item--favorite ${getRelevantActiveClass(favorite)}" type="button">Mark as favorite</button>
          </div>
        </article>
`
  );
};

export default class Card extends AbstractView {
  #film = null;

  constructor(cardProps) {
    const {film, externalHandlers} = {...cardProps};
    super();
    this.#film = film;

    this._externalHandlers.cardClickHandler = externalHandlers.cardClickHandler(this.#film);
    this._externalHandlers.watchListClickHandler = externalHandlers.watchListClickHandler(this.#film);
    this._externalHandlers.watchedClickHandler = externalHandlers.watchedClickHandler(this.#film);
    this._externalHandlers.favoriteClickHandler = externalHandlers.favoriteClickHandler(this.#film);

    const closeButton = this.element.querySelector('.film-card__link');
    const watchlistButton = this.element.querySelector('.film-card__controls-item--add-to-watchlist');
    const watchedButton = this.element.querySelector('.film-card__controls-item--mark-as-watched');
    const favoriteButton = this.element.querySelector('.film-card__controls-item--favorite');

    closeButton.addEventListener('click', this.#cardClickHandler);
    watchlistButton.addEventListener('click', this.#watchListClickHandler);
    watchedButton.addEventListener('click', this.#watchedClickHandler);
    favoriteButton.addEventListener('click', this.#favoriteClickHandler);
  }

  #cardClickHandler = (event) => {
    event.preventDefault();
    this._externalHandlers.cardClickHandler(this.#film);
  }

  #watchListClickHandler = (event) => {
    event.preventDefault();
    this._externalHandlers.watchListClickHandler(this.#film);
  }

  #watchedClickHandler = (event) => {
    event.preventDefault();
    this._externalHandlers.watchedClickHandler(this.#film);
  }

  #favoriteClickHandler = (event) => {
    event.preventDefault();
    this._externalHandlers.favoriteClickHandler(this.#film);
  }

  get id() {
    return this.#film.id;
  }

  get releaseDate() {
    return this.#film.releaseDate;
  }

  get totalRating() {
    return this.#film.totalRating;
  }

  get watchlist() {
    return this.#film.watchlist;
  }

  get template() {
    return createCardTemplate(this.#film);
  }
}
