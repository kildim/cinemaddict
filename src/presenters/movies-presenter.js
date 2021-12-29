import {render, replace} from '../utils/render';
// import UserProfile from '../view/user-profile';
// import MainMenu from '../view/main-menu';
import ListsContainer from '../view/lists-container';
import Sort from '../view/sort';
import ShowMore from '../view/show-more';
import {FILTERS, SORT_TYPE} from '../constants';
import FooterStatistics from '../view/footer-statistics';
import {LIST_EXTRAS_CHUNK, LIST_FILMS_CHUNK} from '../main';
import FilmsEmpty from '../view/films-empty';
import MoviesContainer from '../view/movies-container';
import {changeFilm} from '../data/data-adapter';
import ListPresenter from './list-presenter';
import DetailsPresenter from './details-presenter';

export default class MoviesPresenter {
  #container = null;
  #listHead = null;
  #listTail = null;
  #more = null;
  #onFilmChangesSubscribers = null;
  #detailsPresenter = null;
  #sortType = null;
  #sortedFilms = null;
  #filmsListPresenter = null;
  #menuSort = null;
  #filmsModel = null;

  constructor(main, filmsModel) {
    this.#container = main;
    this.#filmsModel = filmsModel;
    this.#onFilmChangesSubscribers = new Map();
    this.#filmsModel.films = this.#filmsModel.films;
    this.#sortedFilms = [...this.#filmsModel.films];
    this.#sortType = SORT_TYPE.default;
    this.#detailsPresenter = new DetailsPresenter(document.body);
    this.#detailsPresenter.init(this.detailsHandlers, this.subscriptionOnFilmChanges);
    this.#more = new ShowMore();
    this.#listHead = 0;
    this.#listTail = Math.min(this.#filmsModel.films.length, LIST_FILMS_CHUNK);
  }

  subscribeOnFilmChanges = (object, callback) => {
    this.#onFilmChangesSubscribers.set(object, callback);
  }

  unSubscribeOnFilmChanges = (object) => {
    this.#onFilmChangesSubscribers.delete(object);
  }

  notifyOnFilmChanges(film) {
    this.#onFilmChangesSubscribers.forEach((callback) => callback(film));
  }

  subscriptionOnFilmChanges = {
    subscribeOnFilmChanges: this.subscribeOnFilmChanges,
    unSubscribeOnFilmChanges: this.unSubscribeOnFilmChanges
  }

  switchWatchListFlag = (film) => () => {
    film.watchList = !film.watchList;
    changeFilm(film);
    this.notifyOnFilmChanges(film);
  }

  switchWatchedFlag = (film) => () => {
    film.watched = !film.watched;
    changeFilm(film);
    this.notifyOnFilmChanges(film);
  }

  switchFavoriteFlag = (film) => () => {
    film.favorite = !film.favorite;
    changeFilm(film);
    this.notifyOnFilmChanges(film);
  }

  renderDetails = (film) => () => {
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

  renderSorted = (sortType) => {
    if (this.#sortType !== sortType) {
      this.#sortType = sortType;
      switch (this.#sortType) {
        case SORT_TYPE.default:
          this.#sortedFilms = [...this.#filmsModel.films];
          break;
        case  SORT_TYPE.byDate:
          this.#sortedFilms = [...this.#filmsModel.films].sort((prevCard, succCard) => new Date(prevCard.releaseDate) - new Date(succCard.releaseDate));
          break;
        case  SORT_TYPE.byRating:
          this.#sortedFilms = [...this.#filmsModel.films].sort((prevCard, succCard) => prevCard.totalRating - succCard.totalRating);
          break;
      }

      this.#listHead = 0;
      this.#listTail = Math.min(this.#filmsModel.films.length, LIST_FILMS_CHUNK);
      this.#filmsListPresenter.init();

      const listFilmsSampling = this.#sortedFilms.slice(this.#listHead, this.#listTail);
      this.#filmsListPresenter.addChunk(listFilmsSampling);
      this.#filmsListPresenter.renderList();
      const newMenuSort = new Sort(this.#sortType);
      replace(newMenuSort, this.#menuSort);
      this.#menuSort = newMenuSort;
      this.#menuSort.setExternalHandlers(this.renderSorted);
    }
  };

  renderFilmsListsContent(listsContainer) {

    this.#menuSort = new Sort(this.#sortType);
    render(this.#container, this.#menuSort);
    render(this.#container, listsContainer);

    const listFilms = new MoviesContainer('All movies. Upcoming', false);
    const listTopRated = new MoviesContainer('Top rated');
    const listMostCommented = new MoviesContainer('Most commented');

    render(listsContainer, listFilms);
    render(listsContainer, listTopRated);
    render(listsContainer, listMostCommented);

    const listFilmsSampling = this.#sortedFilms.slice(this.#listHead, this.#listTail);
    const listTopRatedSampling = this.#filmsModel.films.slice(0, LIST_EXTRAS_CHUNK);
    const listMostCommentedSampling = this.#filmsModel.films.slice(0, LIST_EXTRAS_CHUNK);

    this.#filmsListPresenter = new ListPresenter(listFilms.cardsContainer);
    this.#filmsListPresenter.setExternalHandlers(this.cardHandlers, this.subscriptionOnFilmChanges);
    this.#filmsListPresenter.addChunk(listFilmsSampling);
    this.#filmsListPresenter.renderList();
    this.#menuSort.setExternalHandlers(this.renderSorted);
    const topRatedList = new ListPresenter(listTopRated.cardsContainer);
    topRatedList.setExternalHandlers(this.cardHandlers, this.subscriptionOnFilmChanges);
    topRatedList.addChunk(listTopRatedSampling);
    topRatedList.renderList();
    const mostCommentedList = new ListPresenter(listMostCommented.cardsContainer);
    mostCommentedList.setExternalHandlers(this.cardHandlers, this.subscriptionOnFilmChanges);
    mostCommentedList.addChunk(listMostCommentedSampling);
    mostCommentedList.renderList();

    if (this.#filmsModel.films.length > this.#listTail) {
      this.#more.setExternalHandlers({clickMore: this.onClickShowMoreHandler(this.#filmsListPresenter)});
      render(listFilms, this.#more);
    }
  }

  renderEmptyListsContent(listsContainer){
    const filmsEmpty = new FilmsEmpty();

    filmsEmpty.init(FILTERS.allMovies);
    render(this.#container, listsContainer);
    render(listsContainer, filmsEmpty);
  }

  renderContent() {
    const listsContainer = new ListsContainer();

    if (this.#filmsModel.films.length > 0) {
      this.renderFilmsListsContent(listsContainer);
    } else {
      this.renderEmptyListsContent(listsContainer);
    }
  }
}
