import FilmDetails from '../view/film-details';
import {removeChildren, render, replace} from '../utils/render';
import {Loader} from '../view/loader';
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
    if (this.#details === null) {
      render(this.#container, newFilmDetails);

    } else {
      this.#details.removeElement();
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

      const COMMENTS_LIST_PROPS = {
        comments: comments,
        commentListHandlers: this.#commentListHandlers,
      };
      this.#commentsList = new CommentsList(COMMENTS_LIST_PROPS);
      render(this.#details.commentsContainer, this.#commentsList);
    }
  }

  get filmId() {
    return this.#details !== null ? this.#details.filmId : null;
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
    this.#commentsList.editCommentControls.forEach((control) => {control.setAttribute('disabled', 'disabled');});
  };

  unblockCommentControls = () => {
    this.#commentsList.editCommentControls.forEach((control) => {control.removeAttribute('disabled');});
  }

  removeDetails() {
    if (this.#details !== null) {
      removeChildren(this.#container);
    }
    this.#details = null;
  }
}
