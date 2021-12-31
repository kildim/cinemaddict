import {render} from '../utils/render';
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

  constructor(header, main, footer) {
    this.#header = header;
    this.#main = main;
    this.#footer = footer;
    this.#moviesModel = new MoviesModel();
    this.#activeMenu = FILTERS.allMovies;
  }

  onChangeActiveMenu(newActiveMenu) {
    // eslint-disable-next-line no-console
    console.log(newActiveMenu);
  }

  renderEmptyListsContent(){
    const filmsEmpty = new FilmsEmpty();

    filmsEmpty.init(this.#activeMenu);
    const listsContainer = new ListsContainer();

    render(this.#main, listsContainer);
    render(listsContainer, filmsEmpty);
  }

  renderFilms() {
    if (this.#moviesModel.films.length > 0) {
      const moviesPresenter = new MoviesPresenter(this.#main, this.#moviesModel);
      moviesPresenter.renderContent();
    } else {
      this.renderEmptyListsContent();
    }
  }

  renderContent() {
    render(this.#header, new UserProfile());

    this.#mainMenu = new MainMenu(this.#moviesModel.watchInfo, this.#activeMenu);
    this.#mainMenu.setExternalHandlers(this.onChangeActiveMenu);
    render(this.#main, this.#mainMenu);

    this.renderFilms();
    render(this.#footer, new FooterStatistics(this.#moviesModel.films.length));
  }
}
