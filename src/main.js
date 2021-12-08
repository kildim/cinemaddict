import {render} from './render';
import UserProfile from './view/user-profile';
import MainMenu from './view/main-menu';
import Sort from './view/sort';
import ListsContainer from './view/lists-container';
import List from './view/list';
import ShowMore from './view/show-more';
import FooterStatistics from './view/footer-statistics';
import Card from './view/card';
import {getFilms, getWatchInfo} from './data/data-adapter';
import FilmDetails from './view/film-details';
import FilmsEmpty from './view/films-empty';
import {filters} from './constants';
import AllMoviesContainer from './view/all-movies-container';
import ExtrasContainer from './view/extras-container';

export const LIST_FILMS_CHUNK = 5;
export const LIST_EXTRAS_CHUNK = 2;


const films = getFilms;
const watchInfo = getWatchInfo;

const renderCards = (container, list, cardHandlers) => list.forEach((item) => {
  const {clickCardHandler} = cardHandlers;
  const card = new Card(item);

  card.setExternalHandlers({clickCard: clickCardHandler(item)});
  render(container, card.element);
});

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const filmDetails = new FilmDetails();
const filmsEmpty = new FilmsEmpty();

const showFilmDetails = (film) => () => {
  filmDetails.init(film);
  render(document.body, filmDetails.element);
};

render(headerElement, new UserProfile().element);
render(mainElement, new MainMenu(watchInfo).element);

const listsContainerElement = new ListsContainer().element;

if (films.length > 0) {
  render(mainElement, new Sort().element);
  render(mainElement, listsContainerElement);

  const listFilms = new AllMoviesContainer();
  const listTopRated = new ExtrasContainer('Top rated');
  const listMostCommented = new ExtrasContainer('Most commented');
  render(listsContainerElement, listFilms.element);
  render(listsContainerElement, listTopRated.element);
  render(listsContainerElement, listMostCommented.element);


  let listFilmsTail = Math.min(films.length, LIST_FILMS_CHUNK);
  let listFilmsHead = 0;
  let listFilmsSampling = films.slice(listFilmsHead, listFilmsTail);

  const listTopRatedSampling = films.slice(0, LIST_EXTRAS_CHUNK);
  const listMostCommentedSampling = films.slice(0, LIST_EXTRAS_CHUNK);

  const listFilmsContainer = listFilms.getContainer();
  const listTopRatedContainer = listTopRated.getContainer();
  const listMostCommentedContainer = listMostCommented.getContainer();

  renderCards(listFilmsContainer, listFilmsSampling, {clickCardHandler: showFilmDetails});
  renderCards(listTopRatedContainer, listTopRatedSampling, {clickCardHandler: showFilmDetails});
  renderCards(listMostCommentedContainer, listMostCommentedSampling, {clickCardHandler: showFilmDetails});

  let showMore = null;
  if (films.length > LIST_FILMS_CHUNK) {
    showMore = new ShowMore();
    render(listFilms.element, showMore.element);
  }

  const onEscapeKeyDownHandler = (event) => {
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();
      filmDetails.removeElement();
    }
  };
  const onClickShowMoreHandler = (event)=> {
    event.preventDefault();
    listFilmsHead = listFilmsTail;
    listFilmsTail += LIST_FILMS_CHUNK;
    if (listFilmsTail > films.length) {
      listFilmsTail = films.length;
      showMore.removeElement();
    }
    listFilmsSampling = films.slice(listFilmsHead, listFilmsTail);
    renderCards(listFilmsContainer, listFilmsSampling, {clickCardHandler: showFilmDetails});
  };

  if (showMore) {
    showMore.element.addEventListener('click', onClickShowMoreHandler);
  }
  document.addEventListener('keydown', onEscapeKeyDownHandler);
} else {
  filmsEmpty.init(filters.allMovies);
  render(mainElement, listsContainerElement);
  render(listsContainerElement, filmsEmpty.element);
}

render(footerElement, new FooterStatistics(films.length).element);
