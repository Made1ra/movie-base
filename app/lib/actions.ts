'use server';

import bcrypt from 'bcrypt';
import { auth, signIn, signOut } from '@/auth';

export async function authorizeUser() {
    try {
        let id = '';
        const session = await auth();
        const response = await fetch(`https://movie-base-backend-production.up.railway.app/?email=${encodeURIComponent(session?.user?.email || '')}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const data = await response.json();
            id = data.id;
        } else {
            id = bcrypt.hashSync(session?.user?.email || '', 0).slice(-10);
            await fetch('https://movie-base-backend-production.up.railway.app/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, name: session?.user?.name, email: session?.user?.email, image: session?.user?.image }),
            });
        }

        if (session?.user) {
            session.user.id = id.toLowerCase();
        }

        return session;
    } catch (error) {
        console.error(error);
    }
}

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

export async function signInToGoogle() {
    await signIn();
}

export async function signOutFromGoogle() {
    await signOut();
}

export async function getWatchlist(userID: string) {
    try {
        const response = await fetch(`https://movie-base-backend-production.up.railway.app/user/:${userID}/watchlist`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
    }
}

export async function postWatchlist(id: string, userID: string, movieID: string) {
    await fetch(`https://movie-base-backend-production.up.railway.app/user/:${userID}/watchlist`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, movieID: movieID }),
    });
}

export async function deleteWatchlist(id: string, userID: string) {
    await fetch(`https://movie-base-backend-production.up.railway.app/user/:${userID}/watchlist`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
    });
}

export async function getRatings(userID: string) {
    try {
        const response = await fetch(`https://movie-base-backend-production.up.railway.app/user/:${userID}/ratings`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
    }
}

export async function postRating(id: string, userID: string, movieID: string, rating: number) {
    await fetch(`https://movie-base-backend-production.up.railway.app/user/:${userID}/watchlist`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, movieID: movieID, rating: rating }),
    });
}

export async function patchRatings(userID: string, rating: number) {
    try {
        const response = await fetch(`https://movie-base-backend-production.up.railway.app/user/:${userID}/ratings`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rating: rating }),
        });
        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
    }
}

export async function deleteRating(id: string, userID: string) {
    await fetch(`https://movie-base-backend-production.up.railway.app/user/:${userID}/rating`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
    });
}
