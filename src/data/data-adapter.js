import {getMockFilms, getMockWatchInfo} from '../mocks/mocks';
import {FILM_MOCKS_COUNT} from '../constants';

export const getFilms = getMockFilms(FILM_MOCKS_COUNT);
export const getWatchInfo = getMockWatchInfo(FILM_MOCKS_COUNT);
