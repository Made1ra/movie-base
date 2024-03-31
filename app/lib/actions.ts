'use server';

export async function getMovie(imdbID: string) {
    try {
        const API_KEY = process.env.API_KEY;
        const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`);

        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

export async function getPoster(imdbID: string) {
    try {
        const API_KEY = process.env.API_KEY;
        const response = await fetch(`https://www.img.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`);

        return await response.json();
    } catch (error) {
        console.error(error);
    }
}
