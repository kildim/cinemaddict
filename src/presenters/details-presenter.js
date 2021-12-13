import {remove, render} from '../utils/render';
import FilmDetails from '../view/film-details';

export default class DetailsPresenter {
  #details = null;
  #detailsHandlers = {};
  #subscribeOnFileChanges = null;
  #unSubscribeOnFileChanges = null;
  #container = null;

  constructor(container) {
    this.#container = container;
  }

  init(detailsHandlers, subscriptionOnFilmChanges) {
    this.#detailsHandlers = detailsHandlers;
    this.#subscribeOnFileChanges = subscriptionOnFilmChanges.subscribeOnFilmChanges;
    this.#unSubscribeOnFileChanges = subscriptionOnFilmChanges.unSubscribeOnFilmChanges;
    this.#subscribeOnFileChanges(this, this.onFilmChanges);
  }


  onFilmChanges = (film) => {
    if (this.#details && this.#details.id === film.id) {
      remove (this.#details);
      this.renderDetails(film);
    }
  }

  renderDetails(film) {
    if (this.#details) {this.#details.removeElement();}
    this.#details = new FilmDetails();
    this.#details.init(film);
    this.#details.setExternalHandlers(this.#detailsHandlers);
    render(this.#container, this.#details);
  }

  removeElement() {
    super.removeElement();
    this.#unSubscribeOnFileChanges(this);
  }
}
