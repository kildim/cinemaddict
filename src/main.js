import {renderTemplate} from './render';
import {createUserProfileTemplate} from './view/user-profile';
import {createMainMenuTemplate} from './view/main-menu';
import {createSortTemplate} from './view/sort';
import {createFilmsTemplate} from './view/films';
import {createListTemplate} from './view/list';
import {createShowMoreTemplate} from './view/show-more';
import {createFooterStatisticsTemplate} from './view/footer-statistics';
import {getMockFilms} from './mocks/mocks';
// import {createFilmDetailsTemplate} from './view/film-details';
import {FILM_MOCKS_COUNT, LIST_EXTRAS_CHUNK, LIST_FILMS_CHUNK} from './constants';

const films = getMockFilms(FILM_MOCKS_COUNT);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

renderTemplate(headerElement, createUserProfileTemplate());
renderTemplate(mainElement, createMainMenuTemplate());
renderTemplate(mainElement, createSortTemplate());
renderTemplate(mainElement, createFilmsTemplate());

const [listFilms, listTopRated, listMostCommented] = document.querySelectorAll('.films-list');

renderTemplate(listFilms, createListTemplate(films, LIST_FILMS_CHUNK));
renderTemplate(listFilms, createShowMoreTemplate());
renderTemplate(listTopRated, createListTemplate(films, LIST_EXTRAS_CHUNK));
renderTemplate(listMostCommented, createListTemplate(films, LIST_EXTRAS_CHUNK));
renderTemplate(footerElement, createFooterStatisticsTemplate());

// renderTemplate(document.body, createFilmDetailsTemplate(films[0]));
