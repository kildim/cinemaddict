export const getWatchedCount =
  (films) => films.reduce((accumulator, film) => {
    if (film.watched) {accumulator++;}
    return accumulator;
  }, 0);

export const getWatchedDuration =
  (films) => films.reduce((accumulator, film) => {
    accumulator += film.runtime;
    return accumulator;
  }, 0);

export const getGenresMap = (films) => {
  const genresMap = new Map();
  films.forEach((film) => {
    const genres = film.genres;
    genres.forEach((genre) => {
      if (genresMap.has(genre)) {
        genresMap.set(genre, genresMap.get(genre)+1);
      } else {
        genresMap.set(genre, 1);
      }
    });
  });
  return genresMap;
};

const findByValue = (map, value) => {
  const KEY_INDEX = 0;
  const VALUE_INDEX = 1;

  for (const entry of map) {
    if (entry[VALUE_INDEX] === value) {
      return entry[KEY_INDEX];
    }
  }
  return '';
};

export const getTopGenre = (genresMap) => {
  const genresCounts = Array.from(genresMap.values());
  const maxCount =  Math.max.apply(null, genresCounts);
  return findByValue(genresMap, maxCount);
};
