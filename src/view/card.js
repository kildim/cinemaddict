import {formatTime} from '../utils/date-time';
import {createElement} from '../render';

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

export default class Card {
  #element = null;
  #film = null;
  constructor(film) {
    this.#film = film;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createCardTemplate(this.#film);
  }

  removeElement() {
    this.#element = null;
  }
}
