import {renderTemplate} from './render';
import {createUserProfileTemplate} from './view/user-profile';
import {createMainMenuTemplate} from './view/main-menu';
import {createSortTemplate} from './view/sort';
import {createFilmsTemplate} from './view/films';
import {createListTemplate} from './view/list';
import {createShowMoreTemplate} from './view/show-more';
import {createFooterStatisticsTemplate} from './view/footer-statistics';
import {createFilmDetailsTemplate} from './view/film-details';
import {createCardTemplate} from './view/card';
import {getFilms, getWatchInfo} from './data/data-adapter';

export const LIST_FILMS_CHUNK = 5;
export const LIST_EXTRAS_CHUNK = 2;


const films = getFilms;
const watchInfo = getWatchInfo;

const createCardsTemplate = (list) => list.reduce((capacitor, item) => capacitor.concat(createCardTemplate(item)), '');

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

renderTemplate(headerElement, createUserProfileTemplate());
renderTemplate(mainElement, createMainMenuTemplate(watchInfo));
renderTemplate(mainElement, createSortTemplate());
renderTemplate(mainElement, createFilmsTemplate());

const [listFilms, listTopRated, listMostCommented] = document.querySelectorAll('.films-list');

let listFilmsTail = Math.min(films.length, LIST_FILMS_CHUNK);
let listFilmsHead = 0;
let listFilmsSampling = films.slice(listFilmsHead, listFilmsTail);

const listTopRatedSampling = films.slice(0, LIST_EXTRAS_CHUNK);
const listMostCommentedSampling = films.slice(0, LIST_EXTRAS_CHUNK);

renderTemplate(listFilms, createListTemplate());

if (films.length > LIST_FILMS_CHUNK) {
  renderTemplate(listFilms, createShowMoreTemplate());
}

renderTemplate(listTopRated, createListTemplate());
renderTemplate(listMostCommented, createListTemplate());

const listFilmsContainer = listFilms.querySelector('.films-list__container');
const listTopRatedContainer = listTopRated.querySelector('.films-list__container');
const listMostCommentedContainer = listMostCommented.querySelector('.films-list__container');
const showMoreButton = document.querySelector('.films-list__show-more');

renderTemplate(listFilmsContainer, createCardsTemplate(listFilmsSampling));
renderTemplate(listTopRatedContainer, createCardsTemplate(listTopRatedSampling));
renderTemplate(listMostCommentedContainer, createCardsTemplate(listMostCommentedSampling));

const onClickShowMoreHandler = (event)=> {
  event.preventDefault();
  listFilmsHead = listFilmsTail;
  listFilmsTail += LIST_FILMS_CHUNK;
  if (listFilmsTail > films.length) {
    listFilmsTail = films.length;
    showMoreButton.remove();
  }
  listFilmsSampling = films.slice(listFilmsHead, listFilmsTail);
  renderTemplate(listFilmsContainer, createCardsTemplate(listFilmsSampling));
};

if (showMoreButton) {
  showMoreButton.addEventListener('click', onClickShowMoreHandler);
}

renderTemplate(footerElement, createFooterStatisticsTemplate(films.length));

renderTemplate(document.body, createFilmDetailsTemplate(films[0]));
