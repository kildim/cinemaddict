import {formatTime} from './date-time';

export const parseFromServerFormat = (serverData) => {
  const filmInfo = serverData['film_info'];
  const userDetails = serverData['user_details'];
  return {
    id: serverData['id'],
    poster: filmInfo['poster'] || '',
    ageRating: filmInfo['age_rating'] || '',
    title: filmInfo['title'] || '',
    alternativeTitle: filmInfo['alternative_title'] || '',
    totalRating: filmInfo['total_rating'] || '',
    director: filmInfo['director'] || '',
    writers: filmInfo['writers'].join(', ') || '',
    actors: filmInfo['actors'].join(', ') || '',
    releaseDate: new Date(filmInfo['release']['date']) || null,
    runtime: formatTime(filmInfo['runtime']) || '',
    releaseCountry: filmInfo['release']['release_country'] || '',
    genres: filmInfo['genre'] || [],
    description: filmInfo['description'] || '',
    watchList: userDetails['watchlist'] || false,
    watched: userDetails['already_watched'] || false,
    favorite: userDetails['favorite'] || false,
    watchingDate: new Date(userDetails['watching_date']) || null,
    comments: serverData['comments'] || [],
  };
};

// export parseToServerFormat(movie) {
//   return {
//     "id":
//   }
// }
