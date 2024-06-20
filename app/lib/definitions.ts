export type Movie = {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  image: string;
};

export type Watchlist = {
  id: string;
  userID: string;
  movieID: string;
};

export type Rating = {
  id: string;
  userID: string;
  movieID: string;
  rating: number;
};
