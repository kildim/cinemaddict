import {getMockFilms, getMockWatchInfo} from '../mocks/mocks';

export const FILM_MOCKS_COUNT = 13;

export const getFilms = getMockFilms(FILM_MOCKS_COUNT);
export const getWatchInfo = getMockWatchInfo(FILM_MOCKS_COUNT);
export function changeFilm(newFilmInfo) {
  // eslint-disable-next-line no-console
  console.log(newFilmInfo);
  // let oldFilmInfo = getFilms.find((movie) => movie.id === newFilmInfo.id);
  // oldFilmInfo = !oldFilmInfo.watched;
}
