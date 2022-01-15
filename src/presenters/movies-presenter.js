import {LIST_EXTRAS_CHUNK, LIST_FILMS_CHUNK, SORT_TYPE} from '../constants';
import MenuSort from '../view/menu-sort';
import {render, replace} from '../utils/render';
import ListsContainer from '../view/lists-container';
import MoviesContainer from '../view/movies-container';
import ListPresenter from './list-presenter';
import ShowMore from '../view/show-more';

export default class MoviesPresenter {
  #cardHandlers = null;
  #menuSort = null;
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

  constructor() {
    this.#sortSelection = SORT_TYPE.default;
  }

  init(moviesPresenterProps) {
    const {container, cardHandlers} = {...moviesPresenterProps};

    this.#container = container;
    this.#cardHandlers = cardHandlers;
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

  renderSorted = () => {
    this.#listHead = 0;
    this.#listTail = Math.min(this.#sortedFilms.length, LIST_FILMS_CHUNK);
    this.#filmsListPresenter.init();

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
    this.#sortedFilms = [...this.#films];
    this.renderSorted();

    this.#sortSelection = SORT_TYPE.default;
    this.renderMenuSort();
  }

  renderByDate = () => {
    this.#sortedFilms = [...this.#films].sort((prevCard, succCard) => new Date(succCard.releaseDate) - new Date(prevCard.releaseDate));
    this.renderSorted();

    this.#sortSelection = SORT_TYPE.byDate;
    this.renderMenuSort();
  }

  renderByRating = () => {
    this.#sortedFilms = [...this.#films].sort((prevCard, succCard) => succCard.totalRating - prevCard.totalRating);
    this.renderSorted();

    this.#sortSelection = SORT_TYPE.byRating;
    this.renderMenuSort();
  }

  renderMenuSort = () => {
    const MENU_SORT_PROPS = {
      sortSelection: this.#sortSelection,
      menuSortHandlers: {
        clickByDefaultHandler: this.renderByDefault,
        clickByDateHandler: this.renderByDate,
        clickByRatingHandler: this.renderByRating,
      }
    };
    const newMenuSort = new MenuSort(MENU_SORT_PROPS);

    if (this.#menuSort === null) {
      render(this.#container, newMenuSort);
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
      const SHOW_MORE_PROPS = {
        showMoreHandlers: {
          clickMore: this.onClickShowMoreHandler(this.#filmsListPresenter),
        }
      };
      const newShowMore = new ShowMore(SHOW_MORE_PROPS);

      if (this.#showMore === null) {
        render(this.#listFilms, newShowMore);
      } else {
        replace(newShowMore, this.#showMore);
      }
      this.#showMore = newShowMore;
    }
  }

  onClickShowMoreHandler = (list) => () => {
    this.#listHead = this.#listTail;
    this.#listTail += LIST_FILMS_CHUNK;
    if (this.#listTail > this.#sortedFilms.length) {
      this.#listTail = this.#sortedFilms.length;
      this.#showMore.removeElement();
    }
    const listFilmsSampling = this.#sortedFilms.slice(this.#listHead, this.#listTail);
    list.addChunk(listFilmsSampling);
  };

  renderFilmsList(filteredMovies) {
    this.#films = filteredMovies;
    this.#sortedFilms = [...this.#films];

    const FILMS_LIST_PRESENTER_PROPS = {
      container: this.#listFilms.cardsContainer,
      cardHandlers: this.#cardHandlers,
    };
    this.#filmsListPresenter = new ListPresenter(FILMS_LIST_PRESENTER_PROPS);

    this.renderByDefault();
  }

  renderTopRatedFilms(topRatedMovies) {
    const FILMS_LIST_PRESENTER_PROPS = {
      container: this.#listTopRated.cardsContainer,
      cardHandlers: this.#cardHandlers,
    };
    this.#topRatedListPresenter = new ListPresenter(FILMS_LIST_PRESENTER_PROPS);
    this.#topRatedListPresenter.addChunk(topRatedMovies.slice(0, LIST_EXTRAS_CHUNK));
  }

  renderMostCommentedFilms(topRatedMovies) {
    const FILMS_LIST_PRESENTER_PROPS = {
      container: this.#listMostCommented.cardsContainer,
      cardHandlers: this.#cardHandlers,
    };
    this.#mostCommentedListPresenter = new ListPresenter(FILMS_LIST_PRESENTER_PROPS);
    this.#mostCommentedListPresenter.addChunk(topRatedMovies.slice(0, LIST_EXTRAS_CHUNK));
  }

  renderInitContent() {
    this.renderMenuSort();
    this.renderListsContainer();

    this.#listFilms = new MoviesContainer('All movies. Upcoming', false);
    this.#listTopRated = new MoviesContainer('Top rated');
    this.#listMostCommented = new MoviesContainer('Most commented');

    render(this.#listsContainer, this.#listFilms);
    render(this.#listsContainer, this.#listTopRated);
    render(this.#listsContainer, this.#listMostCommented);
  }
}
