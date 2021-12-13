import {render, replace} from '../utils/render';
import UserProfile from '../view/user-profile';
import MainMenu from '../view/main-menu';
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
  #films = null;
  #watchInfo = null;
  #header = null;
  #main = null;
  #footer = null
  #listHead = null;
  #listTail = null;
  #more = null;
  #onFilmChangesSubscribers = null;
  #detailsPresenter = null;
  #sortType = null;
  #sortedFilms = null;
  #filmsListPresenter = null;
  #menuSort = null;

  constructor(header, main, footer) {
    this.#header = header;
    this.#main = main;
    this.#footer = footer;
    this.#onFilmChangesSubscribers = new Map();
  }

  init (films, watchInfo) {
    this.#films = films;
    this.#sortedFilms = [...this.#films];
    this.#sortType = SORT_TYPE.default;
    this.#watchInfo = watchInfo;
    this.#detailsPresenter = new DetailsPresenter(document.body);
    this.#detailsPresenter.init(this.detailsHandlers, this.subscriptionOnFilmChanges);
    this.#more = new ShowMore();
    this.#listHead = 0;
    this.#listTail = Math.min(this.#films.length, LIST_FILMS_CHUNK);
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

  changeSort = (sortType) => {
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
          this.#sortedFilms = [...this.#films].sort((prevCard, succCard) => prevCard.totalRating - succCard.totalRating);
          break;
      }

      this.#listHead = 0;
      this.#listTail = Math.min(this.#films.length, LIST_FILMS_CHUNK);
      this.#filmsListPresenter.init();

      const listFilmsSampling = this.#sortedFilms.slice(this.#listHead, this.#listTail);
      this.#filmsListPresenter.addChunk(listFilmsSampling);
      this.#filmsListPresenter.renderList();
      const newMenuSort = new Sort(this.#sortType);
      replace(newMenuSort, this.#menuSort);
      this.#menuSort = newMenuSort;
      this.#menuSort.setExternalHandlers(this.changeSort);
    }
  };

  renderFilmsListsContent(listsContainer) {

    this.#menuSort = new Sort(this.#sortType);
    render(this.#main, this.#menuSort);
    render(this.#main, listsContainer);

    const listFilms = new MoviesContainer('All movies. Upcoming', false);
    const listTopRated = new MoviesContainer('Top rated');
    const listMostCommented = new MoviesContainer('Most commented');

    render(listsContainer, listFilms);
    render(listsContainer, listTopRated);
    render(listsContainer, listMostCommented);

    const listFilmsSampling = this.#sortedFilms.slice(this.#listHead, this.#listTail);
    const listTopRatedSampling = this.#films.slice(0, LIST_EXTRAS_CHUNK);
    const listMostCommentedSampling = this.#films.slice(0, LIST_EXTRAS_CHUNK);

    this.#filmsListPresenter = new ListPresenter(listFilms.cardsContainer);
    this.#filmsListPresenter.setExternalHandlers(this.cardHandlers, this.subscriptionOnFilmChanges);
    this.#filmsListPresenter.addChunk(listFilmsSampling);
    this.#filmsListPresenter.renderList();
    this.#menuSort.setExternalHandlers(this.changeSort);
    const topRatedList = new ListPresenter(listTopRated.cardsContainer);
    topRatedList.setExternalHandlers(this.cardHandlers, this.subscriptionOnFilmChanges);
    topRatedList.addChunk(listTopRatedSampling);
    topRatedList.renderList();
    const mostCommentedList = new ListPresenter(listMostCommented.cardsContainer);
    mostCommentedList.setExternalHandlers(this.cardHandlers, this.subscriptionOnFilmChanges);
    mostCommentedList.addChunk(listMostCommentedSampling);
    mostCommentedList.renderList();

    if (this.#films.length > this.#listTail) {
      this.#more.setExternalHandlers({clickMore: this.onClickShowMoreHandler(this.#filmsListPresenter)});
      render(listFilms, this.#more);
    }
  }

  renderEmptyListsContent(listsContainer){
    const filmsEmpty = new FilmsEmpty();

    filmsEmpty.init(FILTERS.allMovies);
    render(this.#main, listsContainer);
    render(listsContainer, filmsEmpty);
  }

  renderContent() {
    render(this.#header, new UserProfile());
    render(this.#main, new MainMenu(this.#watchInfo));

    const listsContainer = new ListsContainer();

    if (this.#films.length > 0) {
      this.renderFilmsListsContent(listsContainer);
    } else {
      this.renderEmptyListsContent(listsContainer);
    }

    render(this.#footer, new FooterStatistics(this.#films.length));
  }
}
