import {getMockFilms} from '../mocks/mocks';

export const FILM_MOCKS_COUNT = 13;

export const getFilms = getMockFilms(FILM_MOCKS_COUNT);
export function changeFilm(newFilmInfo, filmInfoChangedCB) {
  // eslint-disable-next-line no-console
  console.log(newFilmInfo);
  filmInfoChangedCB(newFilmInfo);
}
