import FilmDetails from '../view/film-details';
import {removeChildren, render, replace} from '../utils/render';
import {Loader} from '../view/loader';
import CommentsList from '../view/comments-list';

export default class DetailsPresenter {
  #container = null;
  #details = null;
  #commentsList = null;
  #detailsHandlers = {};
  isCommentsLoading = null;

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
    if (this.isCommentsLoading) {
      render(this.#details.commentsContainer, new Loader());
    }
  }

  renderComments = (comments) => {
    if (this.#details) {
      removeChildren(this.#details.commentsContainer);
      this.#commentsList = new CommentsList(comments);
      render(this.#details.commentsContainer, this.#commentsList);
    }
  }

  updateDetails(film) {
    if (this.#details !== null && this.#details.filmId === film.id) {
      this.renderDetails(film);
      render(this.#details.commentsContainer, this.#commentsList);
    }
  }

  removeDetails() {
    if (this.#details !== null) {
      removeChildren(this.#container);
    }
    this.#details = null;
  }
}
