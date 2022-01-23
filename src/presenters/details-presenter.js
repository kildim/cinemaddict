import FilmDetails from '../view/film-details';
import {removeChildren, render} from '../utils/render';
import Loader from '../view/loader';
import CommentsList from '../view/comments-list';

export default class DetailsPresenter {
  #container = null;
  #details = null;
  #commentsList = null;
  #detailsHandlers = {};
  #commentListHandlers = {};
  isCommentsLoading = null;

  constructor(props) {
    const {container, detailsHandlers, commentListHandlers} = {...props};
    this.#container = container;
    this.#detailsHandlers = detailsHandlers;
    this.#commentListHandlers = commentListHandlers;
  }

  renderDetails = (film) => {
    const newFilmDetails = new FilmDetails(film, this.#detailsHandlers);
    if (this.#details !== null) {
      this.#details.removeElement();
    }
    render(this.#container, newFilmDetails);
    this.#details = newFilmDetails;

    if (this.isCommentsLoading) {
      render(this.#details.commentsContainer, new Loader());
    }
  }

  renderComments = (comments) => {
    if (this.#commentsList !== null) {
      this.#commentsList.removeElement();
    }

    removeChildren(this.#details.commentsContainer);

    if (this.#details) {
      this.#commentsList = new CommentsList({
        comments: comments,
        commentListHandlers: this.#commentListHandlers,
      });
      render(this.#details.commentsContainer, this.#commentsList);
    }
  }

  get filmId() {
    return this.#details !== null ? this.#details.film.id : null;
  }

  updateDetails(film) {
    if (this.#details !== null && this.filmId === film.id) {
      this.renderDetails(film);
      render(this.#details.commentsContainer, this.#commentsList);
    }
  }

  shake = () => {
    this.#details.shake();
  }

  blockCommentControls = () => {
    this.#commentsList.editCommentControls.forEach((control) => {
      control.setAttribute('disabled', 'true');
    });
  };

  unblockCommentControls = () => {
    this.#commentsList.editCommentControls.forEach((control) => {
      control.removeAttribute('disabled');
    });
  }

  removeDetails() {
    if (this.#details !== null) {
      this.#commentsList.removeElement();
      this.#details.removeElement();
    }
    this.#details = null;
  }
}
