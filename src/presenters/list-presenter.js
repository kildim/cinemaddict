import Card from '../view/card';
import {render, replace} from '../utils/render';
const NOT_FOUND = -1;

export default class ListPresenter {
  #cards = [];
  #container = null;
  #cardHandlers = {};

  constructor(listPresenterProps) {
    const {container, cardHandlers} = {...listPresenterProps};

    this.#container = container;
    this.#cardHandlers = cardHandlers;
  }

  updateCard(film) {
    const cardIndex = this.#cards.findIndex((card) => card.id === film.id);
    if (cardIndex > NOT_FOUND) {
      const oldCard = this.#cards[cardIndex];
      const newCard = new Card({
        film: film,
        externalHandlers: this.#cardHandlers,
      });
      this.#cards[cardIndex] = newCard;
      replace(newCard, oldCard);
      oldCard.removeElement();
    }
  }

  addChunk(chunk) {
    chunk.forEach((film) => {

      const card = new Card({
        film: film,
        externalHandlers: this.#cardHandlers,
      });

      this.#cards.push(card);
    });
    this.renderList();
  }

  clearList = () => {
    while (this.#container.firstChild) {
      this.#container.removeChild(this.#container.firstChild);
    }
  }

  renderList = () => {
    this.clearList();
    this.#cards.forEach((card) => render(this.#container, card));
  }
}
