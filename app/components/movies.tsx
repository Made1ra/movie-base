'use client';

import { memo, useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { Movie } from '@/app/lib/definitions';
import { getMovies } from '@/app/lib/actions';
import MovieCard from '@/app/components/movie-card';

function Movies({ query }: { query: string }) {
    const [movies, setMovies] = useState<Array<Movie>>([]);

    useEffect(() => {
        async function fetchMovies() {
            const movies = await getMovies(query);
            setMovies(movies);
        }

        fetchMovies();
    }, [query]);

    return (
        <div>
            {movies && (
                <div className="flex flex-col justify-center items-center m-4">
                    {movies.map((movie: Movie) => (
                        <MovieCard
                            key={movie.imdbID}
                            imdbID={movie.imdbID}
                            Poster={movie.Poster}
                            Title={movie.Title}
                            Year={movie.Year}
                        />
                    ))}
                </div>
            )}
            {(!movies && query !== '') && (
                <Typography className="text-center">No results found for {query}</Typography>
            )}
        </div>
    );
}

export default memo(Movies);
