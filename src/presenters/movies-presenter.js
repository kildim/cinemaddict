import {render} from '../utils/render';
import UserProfile from '../view/user-profile';
import MainMenu from '../view/main-menu';
import ListsContainer from '../view/lists-container';
import Sort from '../view/sort';
import ShowMore from '../view/show-more';
import {filters} from '../constants';
import FooterStatistics from '../view/footer-statistics';
import {LIST_EXTRAS_CHUNK, LIST_FILMS_CHUNK} from '../main';
import FilmDetails from '../view/film-details';
import FilmsEmpty from '../view/films-empty';
import MoviesContainer from '../view/movies-container';

export default class MoviesPresenter {
  #films = null;
  #watchInfo = null;
  #header = null;
  #main = null;
  #footer = null
  #details = null;
  #listHead = null;
  #listTail = null;
  #more = null;

  constructor(header, main, footer) {
    this.#header = header;
    this.#main = main;
    this.#footer = footer;
  }

  init(films, watchInfo) {
    this.#films = films;
    this.#watchInfo = watchInfo;
    this.#details = new FilmDetails();
    this.#more = new ShowMore();
    this.#listHead = 0;
    this.#listTail = Math.min(this.#films.length, LIST_FILMS_CHUNK);
  }

  renderDetails = (film) => () => {
    this.#details.init(film);
    render(document.body, this.#details);
  };

  onClickShowMoreHandler = (list) => () => {
    this.#listHead = this.#listTail;
    this.#listTail += LIST_FILMS_CHUNK;
    if (this.#listTail > this.#films.length) {
      this.#listTail = this.#films.length;
      this.#more.removeElement();
    }
    const listFilmsSampling = this.#films.slice(this.#listHead, this.#listTail);
    list.renderCards(listFilmsSampling, {clickCardHandler: this.renderDetails});
  };

  renderFilmsListsContent(listsContainer) {
    render(this.#main, new Sort());
    render(this.#main, listsContainer);

    const listFilms = new MoviesContainer('All movies. Upcoming', false);
    const listTopRated = new MoviesContainer('Top rated');
    const listMostCommented = new MoviesContainer('Most commented');

    render(listsContainer, listFilms);
    render(listsContainer, listTopRated);
    render(listsContainer, listMostCommented);

    const listFilmsSampling = this.#films.slice(this.#listHead, this.#listTail);
    const listTopRatedSampling = this.#films.slice(0, LIST_EXTRAS_CHUNK);
    const listMostCommentedSampling = this.#films.slice(0, LIST_EXTRAS_CHUNK);

    listFilms.renderCards(listFilmsSampling, {clickCardHandler: this.renderDetails});
    listTopRated.renderCards(listTopRatedSampling, {clickCardHandler: this.renderDetails});
    listMostCommented.renderCards(listMostCommentedSampling, {clickCardHandler: this.renderDetails});

    if (this.#films.length > this.#listTail) {
      this.#more.setExternalHandlers({clickMore: this.onClickShowMoreHandler(listFilms)});
      render(listFilms, this.#more);
    }
  }

  renderEmptyListsContent(listsContainer){
    const filmsEmpty = new FilmsEmpty();

    filmsEmpty.init(filters.allMovies);
    render(this.#main, listsContainer);
    render(listsContainer, filmsEmpty);
  }

  renderContent() {
    render(this.#header, new UserProfile().element);
    render(this.#main, new MainMenu(this.#watchInfo).element);

    const listsContainer = new ListsContainer();

    if (this.#films.length > 0) {
      this.renderFilmsListsContent(listsContainer);
    } else {
      this.renderEmptyListsContent(listsContainer);
    }

    render(this.#footer, new FooterStatistics(this.#films.length));
  }
}
