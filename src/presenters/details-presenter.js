import {remove, render} from '../utils/render';
import FilmDetails from '../view/film-details';

export default class DetailsPresenter {
  #details = null;
  #detailsHandlers = {};
  #unSubscribeOnFileChanges = null;
  #container = null;

  constructor(container) {
    this.#container = container;
  }

  init(detailsHandlers, watchInfoObserver) {
    this.#detailsHandlers = {...detailsHandlers, closeDetailsHandler: this.closeDetails};
    this.#unSubscribeOnFileChanges = watchInfoObserver.removeObserver;
    watchInfoObserver.addObserver(this.onFilmChanges);
  }

  closeDetails = () => () => {
    this.#details.removeElement();
    this.#details = null;
  }

  onFilmChanges = (film) => {
    let scrollPosition = null;
    if (this.#details && this.#details.id === film.id) {
      scrollPosition = this.#details.element.scrollTop;
      remove (this.#details);
      this.renderDetails(film);
      this.#details.element.scrollTop = scrollPosition;
    }
  }

  renderDetails(film) {
    if (this.#details) {this.#details.removeElement();}
    this.#details = new FilmDetails();
    this.#details.init(film);
    this.#details.setExternalHandlers(this.#detailsHandlers);
    render(this.#container, this.#details);
  }

  destruct() {
    this.#unSubscribeOnFileChanges(this);
  }
}
