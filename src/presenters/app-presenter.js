import {removeChildren, render, replace} from '../utils/render';
import UserProfile from '../view/user-profile';
import MainMenu from '../view/main-menu';
import MoviesPresenter from './movies-presenter';
import MoviesModel from '../model/movies-model';
import FooterStatistics from '../view/footer-statistics';
import FilmsEmpty from '../view/films-empty';
import {FILTERS} from '../constants';
import ListsContainer from '../view/lists-container';

export default class AppPresenter {
  #header = null;
  #main = null;
  #footer = null;
  #moviesModel = null;
  #menuSelection = null;
  #mainMenu = null;
  #filteredFilms = null;
  #moviesPresenter = null;

  constructor(header, main, footer) {
    this.#header = header;
    this.#main = main;
    this.#footer = footer;
    this.#moviesModel = new MoviesModel();
    this.#menuSelection = FILTERS.allMovies;
    this.#filteredFilms = this.#moviesModel.films;
    this.#moviesPresenter = new MoviesPresenter(this.#main, this.#moviesModel);

    this.#moviesModel.watchInfoObserver.addObserver(this.renderMainMenu);
  }

  renderSpecifiedContent = (mainMenuSelection) => {
    removeChildren(this.#main);
    this.#mainMenu = null;

    this.#menuSelection = mainMenuSelection;
    this.renderMainMenu();

    if (this.#menuSelection === FILTERS.stats) {
      // eslint-disable-next-line no-console
      console.log('RENDER STATS');
    } else {
      this.renderFilms();
    }

  }

  renderEmptyListsContent() {
    const filmsEmpty = new FilmsEmpty();

    filmsEmpty.init(this.#menuSelection);
    const listsContainer = new ListsContainer();

    render(this.#main, listsContainer);
    render(listsContainer, filmsEmpty);
  }

  renderFilms = () => {
    switch (this.#menuSelection) {
      case FILTERS.allMovies:
        this.#filteredFilms = this.#moviesModel.films;
        break;
      case FILTERS.favorites:
        this.#filteredFilms = this.#moviesModel.favorites;
        break;
      case FILTERS.history:
        this.#filteredFilms = this.#moviesModel.history;
        break;
      case FILTERS.watchlist:
        this.#filteredFilms = this.#moviesModel.watchlist;
        break;
      default:
        throw 'FILMS FILTER NOT SPECIFIED';
    }

    if (this.#filteredFilms.length > 0) {
      this.#moviesPresenter.init(this.#filteredFilms);
    } else {
      this.renderEmptyListsContent();
    }
  }

  renderMainMenu = () => {
    if (this.#mainMenu === null) {
      this.#mainMenu = new MainMenu(this.#moviesModel.watchInfo, this.#menuSelection);
      this.#mainMenu.setExternalHandlers(this.renderSpecifiedContent);
      render(this.#main, this.#mainMenu);
    } else {
      const newMenu = new MainMenu(this.#moviesModel.watchInfo, this.#menuSelection);
      replace(newMenu, this.#mainMenu);
      this.#mainMenu = newMenu;
      this.#mainMenu.setExternalHandlers(this.renderSpecifiedContent);
    }
  }

  renderContent() {
    render(this.#header, new UserProfile());
    this.renderSpecifiedContent(FILTERS.allMovies);
    render(this.#footer, new FooterStatistics(this.#moviesModel.films.length));
  }
}
