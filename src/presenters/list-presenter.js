import Card from '../view/card';
import {render, replace} from '../utils/render';
import {removeChildren} from '../utils/render';
const NOT_FOUND = -1;

export default class ListPresenter {
  #cards = [];
  #container = null;
  #cardHandlers = {};
  // #subscribeOnWatchInfoChanges = null;
  #unSubscribeOnWatchInfoChanges = null;

  constructor(container) {
    this.#container = container;
  }

  init() {
    this.#cards = [];
  }

  setExternalHandlers(cardHandlers, watchInfoObserver) {
    this.#cardHandlers = cardHandlers;
    // this.#subscribeOnWatchInfoChanges = watchInfoObserver.addObserver;
    this.#unSubscribeOnWatchInfoChanges = watchInfoObserver.removeObserver;
    // this.#subscribeOnWatchInfoChanges(this.onFilmChanges);
    watchInfoObserver.addObserver(this.onFilmChanges);
  }

  onFilmChanges = (film) => {
    const cardIndex = this.#cards.findIndex((card) => card.id === film.id);
    if (cardIndex > NOT_FOUND) {
      const oldCard = this.#cards[cardIndex];
      const newCard = new Card(film);
      newCard.setExternalHandlers(this.#cardHandlers);
      this.#cards[cardIndex] = newCard;
      replace(newCard, oldCard);
      oldCard.removeElement();
    }
  }

  addChunk(chunk) {
    chunk.forEach((film) => {
      const card = new Card(film);
      card.setExternalHandlers(this.#cardHandlers);
      this.#cards.push(card);
    });
    this.renderList();
  }

  renderList() {
    removeChildren(this.#container);
    this.#cards.forEach((card) => render(this.#container, card));
  }
}
