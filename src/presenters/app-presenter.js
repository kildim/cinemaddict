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

  constructor(header, main, footer) {
    this.#header = header;
    this.#main = main;
    this.#footer = footer;
    this.#moviesModel = new MoviesModel();
  }

  renderEmptyListsContent(){
    const filmsEmpty = new FilmsEmpty();

    filmsEmpty.init(FILTERS.allMovies);
    const listsContainer = new ListsContainer();

    render(this.#main, listsContainer);
    render(listsContainer, filmsEmpty);
  }

  renderContent() {
    render(this.#header, new UserProfile());
    render(this.#main, new MainMenu(this.#moviesModel.watchInfo));
    if (this.#moviesModel.films.length > 0) {
      const moviesPresenter = new MoviesPresenter(this.#main, this.#moviesModel);
      moviesPresenter.renderContent();
    } else {
      this.renderEmptyListsContent();
    }

    render(this.#footer, new FooterStatistics(this.#moviesModel.films.length));
  }
}
