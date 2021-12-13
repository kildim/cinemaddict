import Card from '../view/card';
import {render, replace} from '../utils/render';
import {removeChildren} from '../utils/render';
import {SORT_TYPE} from '../constants';

export default class ListPresenter {
  #cards = new Map();
  #sort = SORT_TYPE.default;
  #container = null;
  #cardHandlers = {};
  #subscribeOnFileChanges = null;
  #unSubscribeOnFileChanges = null;

  constructor(container) {
    this.#container = container;
  }

  init(cardHandlers, subscriptionOnFilmChanges) {
    this.#cardHandlers = cardHandlers;
    this.#subscribeOnFileChanges = subscriptionOnFilmChanges.subscribeOnFilmChanges;
    this.#unSubscribeOnFileChanges = subscriptionOnFilmChanges.unSubscribeOnFilmChanges;
    this.#subscribeOnFileChanges(this, this.onFilmChanges);
  }

  onFilmChanges = (film) => {
    const oldCard = this.#cards.get(film.id);
    const  newCard = new Card(film);
    newCard.setExternalHandlers(this.#cardHandlers);
    this.#cards.set(film.id, newCard);
    replace(newCard, oldCard);
  }

  addChunk(chunk) {
    chunk.forEach((film) => {
      const card = new Card(film);
      card.setExternalHandlers(this.#cardHandlers);
      this.#cards.set(card.id, card);
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

  removeElement() {
    super.removeElement();
    this.#unSubscribeOnFileChanges(this);
  }
}
