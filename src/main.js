import {renderTemplate} from './render';
import {createUserProfileTemplate} from './view/user-profile';
import {createMainMenuTemplate} from './view/main-menu';
import {createSortTemplate} from './view/sort';
import {createFilmsTemplate} from './view/films';
import {createListTemplate} from './view/list';
import {createShowMoreTemplate} from './view/show-more';
import {createFooterStatisticsTemplate} from './view/footer-statistics';
import {getMockFilms, getMockWatchInfo} from './mocks/mocks';
import {createFilmDetailsTemplate} from './view/film-details';
import {FILM_MOCKS_COUNT, LIST_EXTRAS_CHUNK, LIST_FILMS_CHUNK} from './constants';
import {createCardTemplate} from './view/card';
import {sliceArray} from './utils/utils';

const films = getMockFilms(FILM_MOCKS_COUNT);
const watchInfo = getMockWatchInfo(FILM_MOCKS_COUNT);

const createCardsTemplate = (list) => {
  if (list.length < 1) {return '';}
  const cardsCount = list.length;
  let cardsTemplate = '';
  for (let index=0; index < cardsCount; index++) {
    cardsTemplate = cardsTemplate.concat(createCardTemplate(list[index]));
  }
  return cardsTemplate;
};

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


if (showMoreButton) {
  showMoreButton.addEventListener('click', (event)=> {
    event.preventDefault();
    listFilmsHead = listFilmsTail + 1;
    listFilmsTail += LIST_FILMS_CHUNK;
    if (listFilmsTail > films.length) {
      listFilmsTail = films.length;
      showMoreButton.remove();
    }
    listFilmsSampling = sliceArray(films, listFilmsHead, listFilmsTail);
    renderTemplate(listFilmsContainer, createCardsTemplate(listFilmsSampling));
  });
}

renderTemplate(footerElement, createFooterStatisticsTemplate());

renderTemplate(document.body, createFilmDetailsTemplate(films[0]));
