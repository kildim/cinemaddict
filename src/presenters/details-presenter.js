import FilmDetails from '../view/film-details';
import {removeChildren, render, replace} from '../utils/render';

export default class DetailsPresenter {
  #container = null;
  #details = null;
  #detailsHandlers = {};

  constructor(props) {
    const {container, detailsHandlers} = {...props};
    this.#container = container;
    this.#detailsHandlers = detailsHandlers;
  }

  renderDetails = (film) => {
    const newFilmDetails = new FilmDetails(film, this.#detailsHandlers);
    if (this.#details === null) {
      render(this.#container, newFilmDetails);

    } else {
      replace(newFilmDetails, this.#details);
    }
    this.#details = newFilmDetails;
  }

  updateDetails(film) {
    if (this.#details !== null && this.#details.filmID === film.id) {
      this.renderDetails(film);
    }
  }

  removeDetails() {
    if (this.#details !== null) {
      removeChildren(this.#container);
    }
    this.#details = null;
  }
}
