import {
    pgTable,
    serial,
    text,
    integer,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    image: text('image').notNull(),
});

export const movies = pgTable('movies', {
    imdbID: text('imdb_id').primaryKey(),
    title: text('title').notNull(),
    year: text('year').notNull(),
    rated: text('rated').notNull(),
    released: text('released').notNull(),
    runtime: text('runtime').notNull(),
    genre: text('genre').notNull(),
    director: text('director').notNull(),
    writer: text('writer').notNull(),
    actors: text('actors').notNull(),
    plot: text('plot').notNull(),
    language: text('language').notNull(),
    country: text('country').notNull(),
    awards: text('awards').notNull(),
    poster: text('poster').notNull(),
    metascore: text('metascore').notNull(),
    imdbRating: text('imdb_rating').notNull(),
    imdbVotes: text('imdb_votes').notNull(),
    type: text('type').notNull(),
    dvd: text('dvd').notNull(),
    boxOffice: text('box_office').notNull(),
    production: text('production').notNull(),
    website: text('website').notNull(),
});

export const ratings = pgTable('ratings', {
    id: serial('id').primaryKey(),
    userID: text('user_id').references(() => users.id).notNull(),
    movieID: text('movie_id').references(() => movies.imdbID).notNull(),
    rating: integer('rating').notNull(),
});

export const watchlist = pgTable('watchlist', {
    id: serial('id').primaryKey(),
    userID: text('user_id').references(() => users.id),
    movieID: text('movie_id').references(() => movies.imdbID),
});
