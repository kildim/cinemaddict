import {formatCommentDataTime, formatDate, formatTime} from '../utils/date-time';
import SmartView from './smart-view';

const EMOJIS_PATHS = {
  'emoji-smile': './images/emoji/smile.png',
  'emoji-sleeping': './images/emoji/sleeping.png',
  'emoji-puke': './images/emoji/puke.png',
  'emoji-angry': './images/emoji/angry.png',
};

const createGenresListTemplate = (genres) =>
  genres.map((genre) => (
    `
      <span class="film-details__genre">${genre}</span>
    `
  )).join(' ');
const getEmotionPath = (emotion) =>  `./images/emoji/${emotion}.png`;

const createCommentsList = (comments) =>
  comments.map((comment) =>
    `
      <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="${getEmotionPath(comment.emotion)}" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${comment.comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          <span class="film-details__comment-day">${formatCommentDataTime(comment.date)}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>
  `
  ).join('');


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
    watchList,
    watched,
    favorite,
    comments
  } = film;

  return (
    `
  <section class="film-details">
  <form class="film-details__inner" action="" method="get">
    <div class="film-details__top-container">
      <div class="film-details__close">
        <button class="film-details__close-btn" type="button">close</button>
      </div>
      <div class="film-details__info-wrap">
        <div class="film-details__poster">
          <img class="film-details__poster-img" src="${poster}" alt="${title} poster">

          <p class="film-details__age">${ageRating}</p>
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
        <button type="button" class="film-details__control-button ${getRelevantActiveClass(watchList)} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
        <button type="button" class="film-details__control-button ${getRelevantActiveClass(watched)} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
        <button type="button" class="film-details__control-button ${getRelevantActiveClass(favorite)} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
      </section>
    </div>

    <div class="film-details__bottom-container">
      <section class="film-details__comments-wrap">
        <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">
          ${createCommentsList(comments)}
        </ul>

        <div class="film-details__new-comment">
          <div class="film-details__add-emoji-label">
          </div>
          <input hidden name="selected-emoji"> 
          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src=${EMOJIS_PATHS['emoji-smile']} width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src=${EMOJIS_PATHS['emoji-sleeping']} width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src=${EMOJIS_PATHS['emoji-puke']} width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src=${EMOJIS_PATHS['emoji-angry']} width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
  </form>
</section>
    `
  );
};

export default class FilmDetails extends SmartView{
  #film = null;
  #closeButton = null;
  #emojis = [];

  init = (film) => {
    this.removeElement();
    this.#film = film;
    this.#closeButton = this.element.querySelector('.film-details__close-btn');
    this.#emojis = Array.from(this.element.querySelectorAll('.film-details__emoji-label'));


    this.#closeButton.addEventListener('click', this.#clickCloseHandler);
    document.addEventListener('keydown', this.#onKeyDownHandler);
    this.#emojis.forEach((emojiLabel) => emojiLabel.addEventListener('click', this.#clickEmotion));
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

  #clickEmotion = (event) => {
    const emoji = event.currentTarget.attributes.for.value;
    const emojisPlace = this.element.querySelector('.film-details__add-emoji-label');
    const prevEmotion = emojisPlace.firstChild;

    const newEmotion = document.createElement('img');
    newEmotion.src = EMOJIS_PATHS[emoji];
    newEmotion.height=55;
    newEmotion.width=55;
    newEmotion.alt='emoji';

    if (prevEmotion) {
      emojisPlace.removeChild(prevEmotion);
    }
    emojisPlace.appendChild(newEmotion);
  }

  setExternalHandlers = (externalHandlers) => {
    this._externalHandlers.closeDetails = externalHandlers.closeDetailsHandler();
    //TODO this._externalHandlers.submitDetails = externalHandlers.submitDetailsHandler();
    this._externalHandlers.clickWatchList = externalHandlers.clickWatchListHandler(this.#film);
    this._externalHandlers.clickWatched = externalHandlers.clickWatchedHandler(this.#film);
    this._externalHandlers.clickFavorite = externalHandlers.clickFavoriteHandler(this.#film);

    const watchListButton = this.element.querySelector('.film-details__control-button--watchlist');
    const watchedButton = this.element.querySelector('.film-details__control-button--watched');
    const favoriteButton = this.element.querySelector('.film-details__control-button--favorite');

    watchListButton.addEventListener('click', this.#clickWatchList);
    watchedButton.addEventListener('click', this.#clickWatched);
    favoriteButton.addEventListener('click', this.#clickFavorite);
  }

  #clickCloseHandler = (event) => {
    event.preventDefault();
    this._externalHandlers.closeDetails();
  }

  #onKeyDownHandler = (event) => {
    if (event.code === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      //TO-DO this._externalHandlers.submitDetails();
    }
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();
      this._externalHandlers.closeDetails();
    }
  };

  get id() {
    return this.#film.id;
  }

  get template() {
    return createFilmDetailsTemplate(this.#film);
  }

  removeElement() {
    document.removeEventListener('keydown', this.#onKeyDownHandler);
    super.removeElement();
  }
}
