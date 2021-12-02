import {renderTemplate} from './render';
import {createUserProfileTemplate} from './view/user-profile';
import {createMainMenuTemplate} from './view/main-menu';
import {createSortTemplate} from './view/sort';
import {createFilmsTemplate} from './view/films';
import {createListTemplate} from './view/list';
import {createShowMoreTemplate} from './view/show-more';
import {createFooterStatisticsTemplate} from './view/footer-statistics';

const LIST_FILMS_CHUNK = 5;
const LIST_EXTRAS_CHUNK = 2;

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

renderTemplate(headerElement, createUserProfileTemplate());
renderTemplate(mainElement, createMainMenuTemplate());
renderTemplate(mainElement, createSortTemplate());
renderTemplate(mainElement, createFilmsTemplate());

const [listFilms, listTopRated, listMostCommented] = document.querySelectorAll('.films-list');

renderTemplate(listFilms, createListTemplate(LIST_FILMS_CHUNK));
renderTemplate(listFilms, createShowMoreTemplate());
renderTemplate(listTopRated, createListTemplate(LIST_EXTRAS_CHUNK));
renderTemplate(listMostCommented, createListTemplate(LIST_EXTRAS_CHUNK));
renderTemplate(footerElement, createFooterStatisticsTemplate());
