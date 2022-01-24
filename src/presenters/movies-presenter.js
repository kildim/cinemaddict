import {Filters, LIST_EXTRAS_CHUNK, LIST_FILMS_CHUNK, SortType} from '../constants';
import MenuSort from '../view/menu-sort';
import {removeChildren, render, replace} from '../utils/render';
import ListsContainer from '../view/lists-container';
import MoviesContainer from '../view/movies-container';
import ListPresenter from './list-presenter';
import ShowMore from '../view/show-more';
import ListContainerCaption from '../view/list-container-caption';
import DatabaseIsEmpty from '../view/database-is-empty';

export default class MoviesPresenter {
  #cardHandlers = null;
  #menuSort = null;
  #filteredSelection = null;
  #sortSelection = null;
  #container = null;
  #listsContainer = null;
  #films = [];
  #sortedFilms = null;
  #showMore = null;
  #listHead = null;
  #listTail = null;
  #listFilms = null;
  #listTopRated = null;
  #listMostCommented = null;
  #filmsListPresenter = null;
  #topRatedListPresenter = null;
  #mostCommentedListPresenter = null;
  #moviesModel = null;

  constructor(moviesModel) {
    this.#sortSelection = SortType.DEFAULT;
    this.#moviesModel = moviesModel;
  }

  init(moviesPresenterProps) {
    const {container, cardHandlers} = {...moviesPresenterProps};

    this.#container = container;
    this.#cardHandlers = cardHandlers;
  }

  clearContent() {
    removeChildren(this.#container);
    this.#menuSort = null;
    this.#listsContainer = null;
    this.#showMore = null;
  }

  updateCard(film) {
    this.#filmsListPresenter.updateCard(film);
    this.#topRatedListPresenter.updateCard(film);
    this.#mostCommentedListPresenter.updateCard(film);
  }

  removeCardFromFilmsList(film) {
    const cardIndex = this.#films.findIndex((card) => card.id === film.id);
    this.#films.splice(cardIndex, 1);
    this.#sortedFilms.splice(cardIndex, 1);

    this.renderSorted();
  }

  generateEmptyTitleMessage = (filter) => {
    let message;
    switch (filter) {
      case Filters.ALL_MOVES:
        message = 'There are no movies in our database';
        break;
      case Filters.WATCHLIST:
        message = 'There are no movies to watch now';
        break;
      case Filters.HISTORY:
        message = 'There are no watched movies now';
        break;
      case Filters.FAVORITES:
        message = 'There are no favorite movies now';
        break;
    }
    return message;
  }

  checkTitle = (listLength) => {
    const listContainerCaption = (listLength > 0) ?
      new ListContainerCaption('All movies. Upcoming') :
      new ListContainerCaption(this.generateEmptyTitleMessage(this.#filteredSelection), true);

    const title = this.#listFilms.titleElement;
    replace(listContainerCaption, title);
  }

  removeMenuSort = () => {
    this.#menuSort.element.remove();
    this.#menuSort = null;
  }

  checkMenuSortVisibility = () => {
    if (this.#sortedFilms.length > 1) {
      this.renderMenuSort();
    } else {
      if (this.#menuSort !== null) {
        this.removeMenuSort();
      }
    }
  }

  renderSorted = () => {

    this.checkMenuSortVisibility();
    this.checkTitle(this.#films.length);

    this.#filmsListPresenter = new ListPresenter({
      container: this.#listFilms.cardsContainer,
      cardHandlers: this.#cardHandlers,
    });

    this.#listHead = 0;
    this.#listTail = Math.min(this.#sortedFilms.length, LIST_FILMS_CHUNK);

    const listFilmsSampling = this.#sortedFilms.slice(this.#listHead, this.#listTail);
    this.#filmsListPresenter.addChunk(listFilmsSampling);

    if (this.#sortedFilms.length > LIST_FILMS_CHUNK) {
      this.renderShowMore();
    } else {
      if (this.#showMore !== null) {
        this.#showMore.removeElement();
        this.#showMore = null;
      }
    }
  };

  renderByDefault = () => {
    this.#sortSelection = SortType.DEFAULT;
    this.#sortedFilms = [...this.#films];
    this.renderSorted();
  }

  renderByDate = () => {
    this.#sortSelection = SortType.BY_DATE;
    this.#sortedFilms = [...this.#films].sort((prevCard, succCard) => new Date(succCard.releaseDate) - new Date(prevCard.releaseDate));
    this.renderSorted();
  }

  renderByRating = () => {
    this.#sortSelection = SortType.BY_RATING;
    this.#sortedFilms = [...this.#films].sort((prevCard, succCard) => succCard.totalRating - prevCard.totalRating);
    this.renderSorted();
  }

  renderMenuSort = () => {
    const newMenuSort = new MenuSort({
      sortSelection: this.#sortSelection,
      menuSortHandlers: {
        clickByDefaultHandler: this.renderByDefault,
        clickByDateHandler: this.renderByDate,
        clickByRatingHandler: this.renderByRating,
      }
    });

    if (this.#menuSort === null) {
      render(this.#container, newMenuSort, 'afterbegin');
    } else {
      replace(newMenuSort, this.#menuSort);
    }
    this.#menuSort = newMenuSort;
  }

  renderListsContainer = () => {
    const newListContainer = new ListsContainer();

    if (this.#listsContainer === null) {
      render(this.#container, newListContainer);
    } else {
      replace(newListContainer, this.#listsContainer);
    }
    this.#listsContainer = newListContainer;
  }

  renderShowMore = () => {
    if (this.#sortedFilms.length > this.#listTail) {
      const newShowMore = new ShowMore({
        showMoreHandlers: {
          clickMore: this.onClickShowMoreHandler(this.#filmsListPresenter),
        }
      });

      if (this.#showMore !== null) {
        this.#showMore.removeElement();
      }

      this.#showMore = newShowMore;
      render(this.#listFilms, newShowMore);
    }
  }

  onClickShowMoreHandler = (list) => () => {
    this.#listHead = this.#listTail;
    this.#listTail += LIST_FILMS_CHUNK;
    if (this.#listTail >= this.#sortedFilms.length) {
      this.#listTail = this.#sortedFilms.length;
      this.#showMore.removeElement();
    }
    const listFilmsSampling = this.#sortedFilms.slice(this.#listHead, this.#listTail);
    list.addChunk(listFilmsSampling);
  };

  renderFilmsList(filterValue) {
    this.#filteredSelection = filterValue;
    switch (this.#filteredSelection) {
      case Filters.ALL_MOVES:
        this.#films = this.#moviesModel.films;
        break;
      case Filters.WATCHLIST:
        this.#films = this.#moviesModel.watchlist;
        break;
      case Filters.HISTORY:
        this.#films = this.#moviesModel.history;
        break;
      case Filters.FAVORITES:
        this.#films = this.#moviesModel.favorites;
        break;
    }

    this.renderByDefault();
  }

  renderTopRatedFilms() {
    if (this.#moviesModel.topRated.length > 0) {
      this.#topRatedListPresenter = new ListPresenter({
        container: this.#listTopRated.cardsContainer,
        cardHandlers: this.#cardHandlers,
      });
      this.#topRatedListPresenter.addChunk([...this.#moviesModel.topRated].slice(0, LIST_EXTRAS_CHUNK));
    } else {
      this.#listTopRated.element.remove();
    }

  }

  renderMostCommentedFilms() {
    if (this.#moviesModel.mostCommented.length > 0) {
      this.#mostCommentedListPresenter = new ListPresenter({
        container: this.#listMostCommented.cardsContainer,
        cardHandlers: this.#cardHandlers,
      });
      this.#mostCommentedListPresenter.addChunk([...this.#moviesModel.mostCommented].slice(0, LIST_EXTRAS_CHUNK));
    } else {
      this.#listMostCommented.element.remove();
    }
  }

  renderFilmsContent = () => {
    this.renderMenuSort();
    this.renderListsContainer();

    this.#listFilms = new MoviesContainer('All movies. Upcoming', false);
    this.#listTopRated = new MoviesContainer('Top rated');
    this.#listMostCommented = new MoviesContainer('Most commented');

    render(this.#listsContainer, this.#listFilms);
    render(this.#listsContainer, this.#listTopRated);
    render(this.#listsContainer, this.#listMostCommented);
  }

  renderDatabaseIsEmpty() {
    if (this.#moviesModel.films < 1) {
      render(this.#container, new DatabaseIsEmpty());
    }
  }
}
