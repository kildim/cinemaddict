import {RenderPosition, renderTemplate} from './render';
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

renderTemplate(headerElement, createUserProfileTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainElement, createMainMenuTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainElement, createSortTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainElement, createFilmsTemplate(), RenderPosition.BEFOREEND);

const [listFilms, listTopRated, listMostCommented] = document.querySelectorAll('.films-list');

renderTemplate(listFilms, createListTemplate(LIST_FILMS_CHUNK), RenderPosition.BEFOREEND);
renderTemplate(listFilms, createShowMoreTemplate(), RenderPosition.BEFOREEND);
renderTemplate(listTopRated, createListTemplate(LIST_EXTRAS_CHUNK), RenderPosition.BEFOREEND);
renderTemplate(listMostCommented, createListTemplate(LIST_EXTRAS_CHUNK), RenderPosition.BEFOREEND);
renderTemplate(footerElement, createFooterStatisticsTemplate(), RenderPosition.BEFOREEND);
