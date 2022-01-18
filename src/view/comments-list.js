import AbstractView from './abstract-view';
import {formatCommentDataTime} from '../utils/date-time';

const getEmotionPath = (emotion) =>  `./images/emoji/${emotion}.png`;
const EMOJIS_PATHS = {
  'emoji-smile': './images/emoji/smile.png',
  'emoji-sleeping': './images/emoji/sleeping.png',
  'emoji-puke': './images/emoji/puke.png',
  'emoji-angry': './images/emoji/angry.png',
};

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

const createCommentsListTemplate = (comments) => (
  `<section class='film-details__comments-wrap'>
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
  `
);

export default class CommentsList extends AbstractView {
  #comments = null;
  #emojis = null;

  constructor(comments) {
    super();
    this.#comments = comments;
    this.#emojis = Array.from(this.element.querySelectorAll('.film-details__emoji-label'));

    this.#emojis.forEach((emojiLabel) => emojiLabel.addEventListener('click', this.#clickEmotion));
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

  get template() {
    return createCommentsListTemplate(this.#comments);
  }
}
