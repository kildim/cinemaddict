import {render, replace} from '../utils/render';
import ListsContainer from '../view/lists-container';
import Sort from '../view/sort';
import ShowMore from '../view/show-more';
import {SORT_TYPE} from '../constants';
import {LIST_EXTRAS_CHUNK, LIST_FILMS_CHUNK} from '../constants';
import MoviesContainer from '../view/movies-container';
import ListPresenter from './list-presenter';
import DetailsPresenter from './details-presenter';

export default class MoviesPresenter {
  #container = null;
  #listHead = null;
  #listTail = null;
  #more = null;
  #detailsPresenter = null;
  #sortType = null;
  #sortedFilms = null;
  #filmsListPresenter = null;
  #menuSort = null;
  #moviesModel = null;
  #films = [];
  #listFilms = null;

  constructor(container, moviesModel) {
    this.#container = container;
    this.#moviesModel = moviesModel;
  }

  switchWatchListFlag = (film) => () => {
    this.#moviesModel.updateFilm(film.id, {watchList: !film.watchList});
  }

  switchWatchedFlag = (film) => () => {
    this.#moviesModel.changeFilmsWatchedFlag(film);
  }

  switchFavoriteFlag = (film) => () => {
    this.#moviesModel.updateFilm(film.id, {favorite: !film.favorite});
  }

  renderDetails = (film) => () => {
    this.#detailsPresenter = new DetailsPresenter(document.body);
    this.#detailsPresenter.init(this.detailsHandlers, this.#moviesModel);
    this.#detailsPresenter.renderDetails(film);
  };

  cardHandlers = {
    clickCardHandler: this.renderDetails,
    clickWatchListHandler: this.switchWatchListFlag,
    clickWatchedHandler: this.switchWatchedFlag,
    clickFavoriteHandler: this.switchFavoriteFlag
  };

  detailsHandlers = {
    clickWatchListHandler: this.switchWatchListFlag,
    clickWatchedHandler: this.switchWatchedFlag,
    clickFavoriteHandler: this.switchFavoriteFlag
  }

  onClickShowMoreHandler = (list) => () => {
    this.#listHead = this.#listTail;
    this.#listTail += LIST_FILMS_CHUNK;
    if (this.#listTail > this.#sortedFilms.length) {
      this.#listTail = this.#sortedFilms.length;
      this.#more.removeElement();
    }
    const listFilmsSampling = this.#sortedFilms.slice(this.#listHead, this.#listTail);
    list.addChunk(listFilmsSampling);
  };

  renderShowMore = () => {
    if (this.#sortedFilms.length > this.#listTail) {
      this.#more.setExternalHandlers({clickMore: this.onClickShowMoreHandler(this.#filmsListPresenter)});
      render(this.#listFilms, this.#more);
    }
  }

  renderSorted = (sortType) => {
    if (this.#sortType !== sortType) {
      this.#sortType = sortType;
      switch (this.#sortType) {
        case SORT_TYPE.default:
          this.#sortedFilms = [...this.#films];
          break;
        case  SORT_TYPE.byDate:
          this.#sortedFilms = [...this.#films].sort((prevCard, succCard) => new Date(prevCard.releaseDate) - new Date(succCard.releaseDate));
          break;
        case  SORT_TYPE.byRating:
          this.#sortedFilms = [...this.#films].sort((prevCard, succCard) => succCard.totalRating - prevCard.totalRating);
          break;
      }

      this.#listHead = 0;
      this.#listTail = Math.min(this.#sortedFilms.length, LIST_FILMS_CHUNK);
      this.#filmsListPresenter.init();

      const listFilmsSampling = this.#sortedFilms.slice(this.#listHead, this.#listTail);
      this.#filmsListPresenter.addChunk(listFilmsSampling);

      this.renderShowMore();

      const newMenuSort = new Sort(this.#sortType);
      replace(newMenuSort, this.#menuSort);
      this.#menuSort = newMenuSort;
      this.#menuSort.setExternalHandlers(this.renderSorted);
    }
  };

  init(films) {
    this.#films = films;
    this.#sortedFilms = films;
    this.#sortType = SORT_TYPE.default;
    this.#more = new ShowMore();
    this.#listHead = 0;
    this.#listTail = Math.min(this.#films.length, LIST_FILMS_CHUNK);

    const listsContainer = new ListsContainer();

    this.#menuSort = new Sort(this.#sortType);
    this.#menuSort.setExternalHandlers(this.renderSorted);

    render(this.#container, this.#menuSort);
    render(this.#container, listsContainer);

    this.#listFilms = new MoviesContainer('All movies. Upcoming', false);
    const listTopRated = new MoviesContainer('Top rated');
    const listMostCommented = new MoviesContainer('Most commented');

    render(listsContainer, this.#listFilms);
    render(listsContainer, listTopRated);
    render(listsContainer, listMostCommented);

    const listFilmsSampling = this.#sortedFilms.slice(this.#listHead, this.#listTail);
    const listTopRatedSampling = this.#moviesModel.topRated.slice(0, LIST_EXTRAS_CHUNK);
    const listMostCommentedSampling = this.#moviesModel.mostCommented.slice(0, LIST_EXTRAS_CHUNK);

    this.#filmsListPresenter = new ListPresenter(this.#listFilms.cardsContainer);
    this.#filmsListPresenter.setExternalHandlers(this.cardHandlers, this.#moviesModel);
    this.#filmsListPresenter.addChunk(listFilmsSampling);
    this.#filmsListPresenter.renderList();

    this.renderShowMore();

    const topRatedList = new ListPresenter(listTopRated.cardsContainer);
    topRatedList.setExternalHandlers(this.cardHandlers, this.#moviesModel);
    topRatedList.addChunk(listTopRatedSampling);
    topRatedList.renderList();

    const mostCommentedList = new ListPresenter(listMostCommented.cardsContainer);
    mostCommentedList.setExternalHandlers(this.cardHandlers, this.#moviesModel);
    mostCommentedList.addChunk(listMostCommentedSampling);
    mostCommentedList.renderList();
  }
}
