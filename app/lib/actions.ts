'use server';

import bcrypt from 'bcrypt';
import { auth, signIn, signOut } from '@/auth';

export async function authorizeUser() {
    try {
        let id = '';
        const session = await auth();
        if (!session) {
            return null;
        }

        const userEmail = session?.user?.email || '';
        const userName = session?.user?.name || 'Anonymous';
        const userImage = session?.user?.image || '';

        const response = await fetch(`https://movie-base-backend-production.up.railway.app/?email=${encodeURIComponent(userEmail)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const responseBody = await response.text();

        if (responseBody.length > 0) {
            try {
                const data = JSON.parse(responseBody);
                id = data.id;
            } catch (jsonError) {
                console.error('Error parsing JSON:', jsonError);
                id = bcrypt.hashSync(userEmail, 0).slice(-10);
            }
        } else {
            id = bcrypt.hashSync(userEmail, 0).slice(-10);
            const newUserResponse = await fetch('https://movie-base-backend-production.up.railway.app/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    name: userName,
                    email: userEmail,
                    image: userImage,
                }),
            });

            if (!newUserResponse.ok) {
                console.error('Error creating new user:', await newUserResponse.text());
                return null;
            }
        }

        if (session?.user) {
            session.user.id = id.toLowerCase();
        }

        return session;
    } catch (error) {
        console.error('Error authorizing user:', error);
        return null;
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
        const response = await fetch(`https://movie-base-backend-production.up.railway.app/user/${userID}/watchlist`, {
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
    await fetch(`https://movie-base-backend-production.up.railway.app/user/${userID}/watchlist`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, movieID: movieID }),
    });
}

export async function deleteWatchlist(id: string, userID: string) {
    await fetch(`https://movie-base-backend-production.up.railway.app/user/${userID}/watchlist`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
    });
}

export async function getTitleInfo(movieID: string, userID: string) {
    try {
        const response = await fetch(`https://movie-base-backend-production.up.railway.app/title/${movieID}?userID=${userID}`, {
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

export async function getRatings(userID: string) {
    try {
        const response = await fetch(`https://movie-base-backend-production.up.railway.app/user/${userID}/ratings`, {
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
    await fetch(`https://movie-base-backend-production.up.railway.app/user/${userID}/ratings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, movieID: movieID, rating: rating }),
    });
}

export async function patchRatings(id: string, userID: string, rating: number) {
    try {
        const response = await fetch(`https://movie-base-backend-production.up.railway.app/user/${userID}/ratings`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id, rating: rating }),
        });
        const data = await response.json();

        return data;
    } catch (error) {
        console.error(error);
    }
}

export async function deleteRating(id: string, userID: string) {
    await fetch(`https://movie-base-backend-production.up.railway.app/user/${userID}/rating`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
    });
}
