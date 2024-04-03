export type Rating = {
    source: string;
    value: string;
};

export type Movie = {
    title: string;
    year: string;
    rated: string;
    released: string;
    runtime: string;
    genre: string;
    director: string;
    writer: string;
    actors: string;
    plot: string;
    language: string;
    country: string;
    awards: string;
    poster: string;
    ratings: Rating[];
    metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    type: string;
    DVD: string;
    boxOffice: string;
    production: string;
    website: string;
    response: string;
};

export type User = {
    name: string;
    email: string;
    image: string;
    watchlist: Movie[];
    ratings: Movie[];
};