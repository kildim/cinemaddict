import FilmDetails from '../view/film-details';
import {removeChildren, render} from '../utils/render';

export default class DetailsPresenter {
  #container = null;
  #details = null;
  #detailsHandlers = {};

  constructor(props) {
    const {container, detailsHandlers} = {...props};
    this.#container = container;
    this.#detailsHandlers = detailsHandlers;
  }

  renderDetails(film) {
    this.#details = new FilmDetails(film, this.#detailsHandlers);
    render(this.#container, this.#details);
  }

  removeDetails() {
    if (this.#details !== null) {
      removeChildren(this.#container);
    }
    this.#details = null;
  }
}
