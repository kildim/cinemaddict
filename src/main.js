// import {getFilms, getWatchInfo} from './data/data-adapter';
// import MoviesPresenter from './presenters/movies-presenter';
import AppPresenter from './presenters/app-presenter';

export const LIST_FILMS_CHUNK = 5;
export const LIST_EXTRAS_CHUNK = 2;


// const films = getFilms;
// const watchInfo = getWatchInfo;

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const appPresenter = new AppPresenter(headerElement, mainElement, footerElement);
appPresenter.renderContent();
// const moviesPresenter = new MoviesPresenter(headerElement, mainElement, footerElement);
// moviesPresenter.init(films, watchInfo);
// moviesPresenter.renderContent();
