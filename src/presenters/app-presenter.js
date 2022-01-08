import {removeChildren, render, replace} from '../utils/render';
import UserProfile from '../view/user-profile';
import MainMenu from '../view/main-menu';
import MoviesPresenter from './movies-presenter';
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
  #isDataLoading = null;
  #mainMenu = null;
  #filteredFilms = null;
  #moviesPresenter = null;

  constructor(moviesModel) {
    this.#header = document.querySelector('.header');
    this.#main = document.querySelector('.main');
    this.#footer = document.querySelector('.footer');
    this.#moviesModel = moviesModel;
    this.#isDataLoading = false;
    this.#menuSelection = FILTERS.allMovies;
    this.#moviesPresenter = new MoviesPresenter(this.#main, this.#moviesModel);

    this.#moviesModel.addFilmsChangesObserver(() => {
      this.#filteredFilms = this.#moviesModel.movies;
      // eslint-disable-next-line no-console
      console.log('FILMS LOADED APP-PRESENTER!');
      this.renderContent();
    });
    this.#moviesModel.addWatchInfoChangesObserver(this.renderMainMenu);
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
        this.#filteredFilms = this.#moviesModel.movies;
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

  start() {
    //TODO Продумать логику отображения экрана загрузки https://codepen.io/kumarsidharth/pen/VBBbJW
    this.#moviesModel.loadMovies();
  }

  renderContent = () => {
    render(this.#header, new UserProfile());
    this.renderSpecifiedContent(this.#menuSelection);
    render(this.#footer, new FooterStatistics(this.#moviesModel.filmsCount));
  }
}
