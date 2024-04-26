'use server';

import { signOut } from '@/auth';
import { db } from '@/app/server/db';
import { watchlist } from '@/app/server/db/schema';

export async function getMovie(imdbID: string | string[]) {
    try {
        const API_KEY = process.env.API_KEY;
        const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`);
        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
    }
}

export async function getMovies(searchQuery: string) {
    try {
        const API_KEY = process.env.API_KEY;
        const response = await fetch(`https://www.omdbapi.com/?s=${searchQuery}&apikey=${API_KEY}`);
        const data = await response.json();

        return data.Search;
    } catch (error) {
        console.error(error);
    }
}

export async function signOutFromGoogle() {
    await signOut();
}

export async function postWatchlist(id: number, userID: string, movieID: string) {
    await db.insert(watchlist).values({ id: id, userID: userID, movieID: movieID });
}