import {render} from '../utils/render';
import UserProfile from '../view/user-profile';
import MainMenu from '../view/main-menu';
import ListsContainer from '../view/lists-container';
import Sort from '../view/sort';
// import AllMoviesContainer from '../view/all-movies-container';
// import ExtrasContainer from '../view/extras-container';
import ShowMore from '../view/show-more';
import {filters} from '../constants';
import FooterStatistics from '../view/footer-statistics';
import {LIST_EXTRAS_CHUNK, LIST_FILMS_CHUNK} from '../main';
// import Card from '../view/card';
import FilmDetails from '../view/film-details';
import FilmsEmpty from '../view/films-empty';
import MoviesContainer from '../view/movies-container';

// const renderCards = (container, list, cardHandlers) => list.forEach((item) => {
//   const {clickCardHandler} = cardHandlers;
//   const card = new Card(item);
//
//   card.setExternalHandlers({clickCard: clickCardHandler(item)});
//   render(container, card.element);
// });

export default class MoviesPresenter {
  #films = null;
  #watchInfo = null;
  #header = null;
  #main = null;
  #footer = null
  #details = null;
  #listHead = null;
  #listTail = null;
  #more = null;

  constructor(header, main, footer) {
    this.#header = header;
    this.#main = main;
    this.#footer = footer;
  }

  init(films, watchInfo) {
    this.#films = films;
    this.#watchInfo = watchInfo;
    this.#details = new FilmDetails();
    this.#more = new ShowMore();
    this.#listHead = 0;
    this.#listTail = Math.min(this.#films.length, LIST_FILMS_CHUNK);
  }

  showDetails = (film) => () => {
    this.#details.init(film);
    render(document.body, this.#details);
  };

  onClickShowMoreHandler = (event)=> {
    event.preventDefault();
    this.#listHead = this.#listTail;
    this.#listTail += LIST_FILMS_CHUNK;
    if (this.#listTail > this.#films.length) {
      this.#listTail = this.#films.length;
      this.#more.removeElement();
    }
    // const listFilmsSampling = this.#films.slice(this.#listHead, this.#listTail);
    // listFilms.renderCards(listFilmsSampling, {clickCardHandler: this.showDetails});
  };

  renderContent() {
    const filmsEmpty = new FilmsEmpty();

    render(this.#header, new UserProfile().element);
    render(this.#main, new MainMenu(this.#watchInfo).element);

    const listsContainer = new ListsContainer();

    if (this.#films.length > 0) {
      render(this.#main, new Sort());
      render(this.#main, listsContainer);

      const listFilms = new MoviesContainer('All movies. Upcoming', false);
      const listTopRated = new MoviesContainer('Top rated');
      const listMostCommented = new MoviesContainer('Most commented');

      render(listsContainer, listFilms);
      render(listsContainer, listTopRated);
      render(listsContainer, listMostCommented);


      // let listFilmsTail = Math.min(this.#films.length, LIST_FILMS_CHUNK);
      // let listFilmsHead = 0;
      const listFilmsSampling = this.#films.slice(this.#listHead, this.#listTail);

      const listTopRatedSampling = this.#films.slice(0, LIST_EXTRAS_CHUNK);
      const listMostCommentedSampling = this.#films.slice(0, LIST_EXTRAS_CHUNK);

      // const listFilmsContainer = listFilms.getContainer();
      // const listTopRatedContainer = listTopRated.getContainer();
      // const listMostCommentedContainer = listMostCommented.getContainer();

      listFilms.renderCards(listFilmsSampling, {clickCardHandler: this.showDetails});
      listTopRated.renderCards(listTopRatedSampling, {clickCardHandler: this.showDetails});
      listMostCommented.renderCards(listMostCommentedSampling, {clickCardHandler: this.showDetails});

      let showMore = null;
      if (this.#films.length > LIST_FILMS_CHUNK) {
        showMore = new ShowMore();
        render(listFilms.element, showMore.element);
      }


      // const onClickShowMoreHandler = (event)=> {
      //   event.preventDefault();
      //   listFilmsHead = listFilmsTail;
      //   listFilmsTail += LIST_FILMS_CHUNK;
      //   if (listFilmsTail > this.#films.length) {
      //     listFilmsTail = this.#films.length;
      //     showMore.removeElement();
      //   }
      //   listFilmsSampling = this.#films.slice(listFilmsHead, listFilmsTail);
      //   renderCards(listFilmsContainer, listFilmsSampling, {clickCardHandler: this.showDetails});
      // };

    } else {
      filmsEmpty.init(filters.allMovies);
      render(this.#main, listsContainer);
      render(listsContainer, filmsEmpty.element);
    }

    render(this.#footer, new FooterStatistics(this.#films.length).element);
  }
}
