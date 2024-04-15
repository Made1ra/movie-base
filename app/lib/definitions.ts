export type Rating = {
    Source: string;
    Value: string;
};

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
    Ratings: Rating[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: string;
    DVD: string;
    BoxOffice: string;
    Production: string;
    Website: string;
    Response: string;
    isInWatchlist: boolean;
    userRating?: string;
};

export type User = {
    name: string;
    email: string;
    image: string;
    watchlist: Movie[];
    ratings: Movie[];
};
