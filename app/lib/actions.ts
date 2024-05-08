'use server';

import bcrypt from 'bcrypt';
import { auth, signIn, signOut } from '@/auth';

export async function authorizeUser() {
    try {
        const session = await auth();
        const hash = bcrypt.hashSync(session?.user?.email || '', 0);
        const id = hash.substring(hash.length - 10);
        if (session?.user) {
            session.user.id = id;
        }

        const response = await fetch('https://movie-base-backend-production.up.railway.app/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });
        console.log('Session, response', session, response);

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
