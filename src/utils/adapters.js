export const parseFromServerFormat = (serverData) => {
  const filmInfo = serverData['film_info'];
  const userDetails = serverData['user_details'];
  return {
    id: serverData['id'],
    poster: filmInfo['poster'] || '',
    ageRating: filmInfo['age_rating'] || 0,
    title: filmInfo['title'] || '',
    alternativeTitle: filmInfo['alternative_title'] || '',
    totalRating: filmInfo['total_rating'] || '',
    director: filmInfo['director'] || '',
    writers: filmInfo['writers'] || [],
    actors: filmInfo['actors'] || [],
    releaseDate: new Date(filmInfo['release']['date']) || null,
    runtime: filmInfo['runtime'] || null,
    releaseCountry: filmInfo['release']['release_country'] || '',
    genres: filmInfo['genre'] || [],
    description: filmInfo['description'] || '',
    watchlist: userDetails['watchlist'] || false,
    watched: userDetails['already_watched'] || false,
    favorite: userDetails['favorite'] || false,
    watchingDate: new Date(userDetails['watching_date']) || null,
    comments: serverData['comments'] || [],
  };
};

export const parseToServerFormat = (movie) => ({
  'id': movie.id,
  'comments': movie.comments,
  'film_info':
    {
      'title': movie.title,
      'alternative_title': movie.alternativeTitle,
      'total_rating': movie.totalRating,
      'poster': movie.poster,
      'age_rating': movie.ageRating,
      'director': movie.director,
      'writers': movie.writers,
      'actors': movie.actors,
      'release':
        {
          'date': movie.releaseDate.toISOString(),
          'release_country': movie.releaseCountry,
        },
      'runtime': movie.runtime,
      'genre': movie.genres,
      'description': movie.description,
    },
  'user_details':
    {
      'watchlist': movie.watchlist,
      'already_watched': movie.watched,
      'watching_date': movie.watchingDate.toISOString(),
      'favorite': movie.favorite,
    },
});
