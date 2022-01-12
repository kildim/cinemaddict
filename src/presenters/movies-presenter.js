import {LIST_EXTRAS_CHUNK, LIST_FILMS_CHUNK, SORT_TYPE} from '../constants';
import MenuSort from '../view/menu-sort';
import {render, replace} from '../utils/render';
import ListsContainer from '../view/lists-container';
import MoviesContainer from '../view/movies-container';
import ListPresenter from './list-presenter';

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

  constructor() {
    this.#sortSelection = SORT_TYPE.default;
  }

  init(moviesPresenterProps) {
    const {container, cardHandlers} = {...moviesPresenterProps};

    this.#container = container;
    this.#cardHandlers = cardHandlers;
  }

  renderByDefault = () => {
    // eslint-disable-next-line no-console
    console.log('renderByDefault');

    this.#sortSelection = SORT_TYPE.default;
    this.renderMenuSort();
  }

  renderByDate = () => {
    // eslint-disable-next-line no-console
    console.log('renderByDefault');

    this.#sortSelection = SORT_TYPE.byDate;
    this.renderMenuSort();
  }

  renderByRating = () => {
    // eslint-disable-next-line no-console
    console.log('renderByDate');

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

  renderInitContent(initContent) {
    const {movies, topRated, mostCommented} = {...initContent};

    this.#films = movies;
    this.#sortedFilms = [...this.#films];

    this.renderMenuSort();
    this.renderListsContainer();

    this.#listHead = 0;
    this.#listTail = Math.min(this.#films.length, LIST_FILMS_CHUNK);

    this.#listFilms = new MoviesContainer('All movies. Upcoming', false);
    this.#listTopRated = new MoviesContainer('Top rated');
    this.#listMostCommented = new MoviesContainer('Most commented');

    render(this.#listsContainer, this.#listFilms);
    render(this.#listsContainer, this.#listTopRated);
    render(this.#listsContainer, this.#listMostCommented);

    const listFilmsSampling = this.#sortedFilms.slice(this.#listHead, this.#listTail);

    const FILMS_LIST_PRESENTER_PROPS = {
      container: this.#listFilms.cardsContainer,
      cardHandlers: this.#cardHandlers,
    };
    this.#filmsListPresenter = new ListPresenter(FILMS_LIST_PRESENTER_PROPS);
    this.#filmsListPresenter.addChunk(listFilmsSampling);
    this.#filmsListPresenter.renderList();
  }
}
