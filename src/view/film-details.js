import {formatDate, formatTime} from '../utils/date-time';
import SmartView from './smart-view';


const createGenresListTemplate = (genres) =>
  genres.map((genre) => (
    `
      <span class="film-details__genre">${genre}</span>
    `
  )).join(' ');

const commaSeparatedList = (phrases) => phrases.join(', ');
const getRelevantActiveClass = (isActiveFlag) => isActiveFlag ? 'film-details__control-button--active' : '';

const createFilmDetailsTemplate = (film) => {
  const {
    title,
    poster,
    alternativeTitle,
    totalRating,
    director,
    writers,
    actors,
    release,
    runtime,
    releaseCountry,
    genres,
    ageRating,
    description,
    watchlist,
    watched,
    favorite,
  } = film;

  return (
    `
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="${title} poster">

          <p class="film-details__age">${ageRating}+</p>
        </div>

        <div class="film-details__info">
          <div class="film-details__info-head">
            <div class="film-details__title-wrap">
              <h3 class="film-details__title">${title}</h3>
              <p class="film-details__title-original">${alternativeTitle}</p>
            </div>

            <div class="film-details__rating">
              <p class="film-details__total-rating">${totalRating}</p>
            </div>
          </div>

          <table class="film-details__table">
            <tr class="film-details__row">
              <td class="film-details__term">Director</td>
              <td class="film-details__cell">${director}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Writers</td>
              <td class="film-details__cell">${writers}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Actors</td>
              <td class="film-details__cell">${commaSeparatedList(actors)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Release Date</td>
              <td class="film-details__cell">${formatDate(release)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Runtime</td>
              <td class="film-details__cell">${formatTime(runtime)}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">Country</td>
              <td class="film-details__cell">${releaseCountry}</td>
            </tr>
            <tr class="film-details__row">
              <td class="film-details__term">${genres.length > 1 ? 'Genres' : 'Genre'}</td>
              <td class="film-details__cell">
                 ${createGenresListTemplate(genres)}
              </td>
            </tr>
          </table>

          <p class="film-details__film-description">
            ${description}
          </p>
        </div>
      </div>

      <section class="film-details__controls">
        <button type="button" class="film-details__control-button ${getRelevantActiveClass(watchlist)} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button ${getRelevantActiveClass(watched)} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button ${getRelevantActiveClass(favorite)} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
      </section>
    </div>
  </form>
    `
  );
};

export default class FilmDetails extends SmartView{
  #film = null;
  #closeButton = null;
  #commentsContainer = null;

  constructor(film, externalHandlers) {
    super();
    this.#film = film;
    this.#closeButton = this.element.querySelector('.film-details__close-btn');
    this.#commentsContainer = this.element.querySelector('.film-details__bottom-container');

    this._externalHandlers.detailsCloseHandler = externalHandlers.detailsCloseHandler;
    this._externalHandlers.watchListClickHandler = externalHandlers.watchListClickHandler(this.#film);
    this._externalHandlers.watchedClickHandler = externalHandlers.watchedClickHandler(this.#film);
    this._externalHandlers.favoriteClickHandler = externalHandlers.favoriteClickHandler(this.#film);

    const watchlistButton = this.element.querySelector('.film-details__control-button--watchlist');
    const watchedButton = this.element.querySelector('.film-details__control-button--watched');
    const favoriteButton = this.element.querySelector('.film-details__control-button--favorite');

    watchlistButton.addEventListener('click', this.#watchListClickHandler);
    watchedButton.addEventListener('click', this.#watchedClickHandler);
    favoriteButton.addEventListener('click', this.#favoriteClickHandler);

    this.#closeButton.addEventListener('click', this.#closeClickHandler);
    document.addEventListener('keydown', this.#documentKeyDownHandler);
  }

  get film() {
    return this.#film;
  }

  get commentsContainer() {
    return this.#commentsContainer;
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

  #closeClickHandler = (event) => {
    event.preventDefault();
    this._externalHandlers.detailsCloseHandler();
  }

  #documentKeyDownHandler = (event) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();
      this._externalHandlers.detailsCloseHandler();
    }
  };

  get template() {
    return createFilmDetailsTemplate(this.#film);
  }

  removeElement() {
    document.removeEventListener('keydown', this.#documentKeyDownHandler);
    super.removeElement();
  }
}
