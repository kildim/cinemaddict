import {renderTemplate} from './render';
import UserProfile from './view/user-profile';
import MainMenu from './view/main-menu';
import Sort from './view/sort';
import Films from './view/films';
import List from './view/list';
import ShowMore from './view/show-more';
import FooterStatistics from './view/footer-statistics';
// import {createFilmDetailsTemplate} from './view/film-details';
import Card from './view/card';
import {getFilms, getWatchInfo} from './data/data-adapter';

export const LIST_FILMS_CHUNK = 5;
export const LIST_EXTRAS_CHUNK = 2;


const films = getFilms;
const watchInfo = getWatchInfo;

const createCardsTemplate = (list) => list.reduce((capacitor, item) => capacitor.concat(new Card(item).template), '');

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

renderTemplate(headerElement, new UserProfile().template);
renderTemplate(mainElement, new MainMenu(watchInfo).template);
renderTemplate(mainElement, new Sort().template);
renderTemplate(mainElement, new Films().template);

const [listFilms, listTopRated, listMostCommented] = document.querySelectorAll('.films-list');

let listFilmsTail = Math.min(films.length, LIST_FILMS_CHUNK);
let listFilmsHead = 0;
let listFilmsSampling = films.slice(listFilmsHead, listFilmsTail);

const listTopRatedSampling = films.slice(0, LIST_EXTRAS_CHUNK);
const listMostCommentedSampling = films.slice(0, LIST_EXTRAS_CHUNK);

const filmsList = new List();
renderTemplate(listFilms, filmsList.template);

let showMore = null;
if (films.length > LIST_FILMS_CHUNK) {
  showMore = new ShowMore();
  renderTemplate(listFilms, showMore.template);
}

renderTemplate(listTopRated, new List().template);
renderTemplate(listMostCommented, new List().template);

const listFilmsContainer = listFilms.querySelector('.films-list__container');
const listTopRatedContainer = listTopRated.querySelector('.films-list__container');
const listMostCommentedContainer = listMostCommented.querySelector('.films-list__container');
// const showMoreButton = document.querySelector('.films-list__show-more');

renderTemplate(listFilmsContainer, createCardsTemplate(listFilmsSampling));
renderTemplate(listTopRatedContainer, createCardsTemplate(listTopRatedSampling));
renderTemplate(listMostCommentedContainer, createCardsTemplate(listMostCommentedSampling));

// const onClickShowMoreHandler = (event)=> {
//   event.preventDefault();
//   listFilmsHead = listFilmsTail;
//   listFilmsTail += LIST_FILMS_CHUNK;
//   if (listFilmsTail > films.length) {
//     listFilmsTail = films.length;
//     showMore.remove();
//   }
//   listFilmsSampling = films.slice(listFilmsHead, listFilmsTail);
//   renderTemplate(listFilmsContainer, createCardsTemplate(listFilmsSampling));
// };

if (showMore) {
  // eslint-disable-next-line no-console
  console.log(showMore.element);

  // eslint-disable-next-line no-alert
  showMore.element.addEventListener('click', () => alert('CLICK'));
  // showMore.element.addEventListener('click', onClickShowMoreHandler);
}

renderTemplate(footerElement, new FooterStatistics(films.length).template);

// renderTemplate(document.body, createFilmDetailsTemplate(films[0]));
