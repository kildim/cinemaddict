import Card from '../view/card';
import {render} from '../utils/render';
import {removeChildren} from '../utils/render';
import {SORT_TYPE} from '../constants';

export default class ListPresenter {
  #cards = new Set();
  #sort = SORT_TYPE.default;
  #container = null;
  #cardHandlers = {};

  constructor(container) {
    this.#container = container;
  }

  init(cardHandlers) {
    this.#cardHandlers = cardHandlers;
  }

  addChunk(chunk) {
    chunk.forEach((film) => {
      const card = new Card(film);
      card.setExternalHandlers(this.#cardHandlers);
      this.#cards.add(card);
    });
    this.renderList();
  }

  renderList() {
    removeChildren(this.#container);
    switch (this.#sort) {
      case 'Sort by default':
        this.#cards.forEach((card) => render(this.#container, card));
        break;
    }
  }
}
