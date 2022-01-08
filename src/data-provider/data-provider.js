// import {getMockFilms} from '../mocks/mocks';
//
// export const FILM_MOCKS_COUNT = 13;
//
// export const getFilms = getMockFilms(FILM_MOCKS_COUNT);
// export function changeFilm(newFilmInfo, filmInfoChangedCB) {
// eslint-disable-next-line no-console
//   console.log(newFilmInfo);
//   filmInfoChangedCB(newFilmInfo);
// }

import AbstractProvider from './abstract-provider';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class DataProvider extends AbstractProvider{
  #endPoint = null;
  #authorization = null;

  constructor(baseUrl, authorization) {
    super();
    this.#endPoint = baseUrl;
    this.#authorization = authorization;
  }

  loadFilms = async () => await this.#load({url: 'movies'})
    .then(DataProvider.parseResponse)

  updateFilm = async (film) => {
    const response = await this.#load({
      url: `films/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(film),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await DataProvider.parseResponse(response);

    return parsedResponse;
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      DataProvider.checkStatus(response);
      return response;
    } catch (err) {
      DataProvider.catchError(err);
    }
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
