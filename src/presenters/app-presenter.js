import {render} from '../utils/render';
import UserProfile from '../view/user-profile';
import MainMenu from '../view/main-menu';
import MoviesPresenter from './movies-presenter';
import MoviesModel from '../model/movies-model';
import FooterStatistics from '../view/footer-statistics';

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

  renderContent() {
    render(this.#header, new UserProfile());
    // eslint-disable-next-line no-console
    console.log(this.#moviesModel.watchInfo);
    render(this.#main, new MainMenu(this.#moviesModel.watchInfo));
    const moviesPresenter = new MoviesPresenter(this.#main, this.#moviesModel);
    moviesPresenter.renderContent();
    render(this.#footer, new FooterStatistics(this.#moviesModel.films.length));
  }
}
