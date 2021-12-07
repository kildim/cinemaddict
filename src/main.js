import {render, renderTemplate} from './render';
import UserProfile from './view/user-profile';
import MainMenu from './view/main-menu';
import Sort from './view/sort';
import Films from './view/films';
import List from './view/list';
import ShowMore from './view/show-more';
import FooterStatistics from './view/footer-statistics';
import Card from './view/card';
import {getFilms, getWatchInfo} from './data/data-adapter';

export const LIST_FILMS_CHUNK = 5;
export const LIST_EXTRAS_CHUNK = 2;


const films = getFilms;
const watchInfo = getWatchInfo;

const renderCards = (container, list) => list.forEach((item) => render(container, new Card(item).element));

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

render(headerElement, new UserProfile().element);
render(mainElement, new MainMenu(watchInfo).element);
render(mainElement, new Sort().element);
render(mainElement, new Films().element);

const [listFilms, listTopRated, listMostCommented] = document.querySelectorAll('.films-list');

let listFilmsTail = Math.min(films.length, LIST_FILMS_CHUNK);
let listFilmsHead = 0;
let listFilmsSampling = films.slice(listFilmsHead, listFilmsTail);

const listTopRatedSampling = films.slice(0, LIST_EXTRAS_CHUNK);
const listMostCommentedSampling = films.slice(0, LIST_EXTRAS_CHUNK);

const filmsList = new List();
render(listFilms, filmsList.element);

let showMore = null;
if (films.length > LIST_FILMS_CHUNK) {
  showMore = new ShowMore();
  render(listFilms, showMore.element);
}

render(listTopRated, new List().element);
render(listMostCommented, new List().element);

const listFilmsContainer = listFilms.querySelector('.films-list__container');
const listTopRatedContainer = listTopRated.querySelector('.films-list__container');
const listMostCommentedContainer = listMostCommented.querySelector('.films-list__container');

renderCards(listFilmsContainer, listFilmsSampling);
renderCards(listTopRatedContainer, listTopRatedSampling);
renderCards(listMostCommentedContainer, listMostCommentedSampling);


const onClickShowMoreHandler = (event)=> {
  event.preventDefault();
  listFilmsHead = listFilmsTail;
  listFilmsTail += LIST_FILMS_CHUNK;
  if (listFilmsTail > films.length) {
    listFilmsTail = films.length;
    showMore.removeElement();
  }
  listFilmsSampling = films.slice(listFilmsHead, listFilmsTail);
  renderCards(listFilmsContainer, listFilmsSampling);
};

if (showMore) {
  showMore.element.addEventListener('click', onClickShowMoreHandler);
}

renderTemplate(footerElement, new FooterStatistics(films.length).template);
