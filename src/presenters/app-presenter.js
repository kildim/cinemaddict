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
  #activeMenu = null;
  #mainMenu = null;
  #filteredFilms = null;
  #moviesPresenter = null;

  constructor(header, main, footer) {
    this.#header = header;
    this.#main = main;
    this.#footer = footer;
    this.#moviesModel = new MoviesModel();
    this.#activeMenu = FILTERS.allMovies;
    this.#filteredFilms = this.#moviesModel.films;
    this.#moviesPresenter = new MoviesPresenter(this.#main, this.#moviesModel);

    this.#moviesModel.watchInfoObserver.addObserver(this.renderMainMenu);
  }

  onChangeActiveMenu = (newActiveMenu) => {
    removeChildren(this.#main);
    this.#mainMenu = null;

    this.#activeMenu = newActiveMenu;
    this.renderMainMenu();

    switch (this.#activeMenu) {
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
    }

    this.renderFilms(this.#filteredFilms);
    // eslint-disable-next-line no-console
    // console.log(this.#filteredFilms);
  }

  renderEmptyListsContent(){
    const filmsEmpty = new FilmsEmpty();

    filmsEmpty.init(this.#activeMenu);
    const listsContainer = new ListsContainer();

    render(this.#main, listsContainer);
    render(listsContainer, filmsEmpty);
  }

  renderFilms = (films) => {
    if (films.length > 0) {
      this.#moviesPresenter.init(films);
    } else {
      this.renderEmptyListsContent();
    }
  }

  renderMainMenu = () => {
    if (this.#mainMenu === null) {
      this.#mainMenu = new MainMenu(this.#moviesModel.watchInfo, this.#activeMenu);
      this.#mainMenu.setExternalHandlers(this.onChangeActiveMenu);
      render(this.#main, this.#mainMenu);
    } else {
      const newMenu = new MainMenu(this.#moviesModel.watchInfo, this.#activeMenu);
      replace(newMenu, this.#mainMenu);
      this.#mainMenu = newMenu;
      this.#mainMenu.setExternalHandlers(this.onChangeActiveMenu);
    }
  }

  renderContent() {
    render(this.#header, new UserProfile());
    this.renderMainMenu();
    this.renderFilms(this.#moviesModel.films);
    render(this.#footer, new FooterStatistics(this.#moviesModel.films.length));
  }
}
