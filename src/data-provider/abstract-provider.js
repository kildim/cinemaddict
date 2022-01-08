export default class AbstractProvider {

  constructor() {
    if (new.target === AbstractProvider) {
      throw new Error('Can\'t instantiate AbstractProvider, only concrete one.');
    }
  }

  loadFilms() {
    throw new Error('Abstract method not implemented: get getFilms()');
  }

  updateFilm() {
    throw new Error('Abstract method not implemented: updateFilm()');
  }
}
