'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { Movie, Watchlist } from '@/app/lib/definitions';
import { getWatchlist, getMovie } from '@/app/lib/actions';
import { useUserStore } from '@/app/stores/user-store';
import BackButton from '@/app/components/back-button';
import AccountMenu from '@/app/components/account-menu';
import MovieCard from '@/app/components/movie-card';

export default function Watchlist() {
    const { id } = useParams();
    const { user } = useUserStore((state) => state);
    const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);

    useEffect(() => {
        async function fetchWatchlist() {
            const watchlist = await getWatchlist(typeof id === 'string' ? id : id[0]);
            const movies = await Promise.all(watchlist.map(async (w: Watchlist) => {
                const movie = await getMovie(w.movieID);
                return movie;
            }));
            setWatchlistMovies(movies);
        }

        fetchWatchlist();
    }, [id]);

    return (
        <div>
            <div className="absolute top-8 left-8">
                <BackButton />
            </div>
            <div className="flex flex-col items-center justify-center mb-8">
                {watchlistMovies.map((movie: Movie) => (
                    <Link
                        href={`/title/${movie.imdbID}`}
                        key={movie.imdbID}
                    >
                        <MovieCard
                            poster={movie.Poster}
                            title={movie.Title}
                            imdbRating={movie.imdbRating}
                            year={movie.Year}
                            rated={movie.Rated}
                            runtime={movie.Runtime}
                            plot={movie.Plot}
                            director={movie.Director}
                            actors={movie.Actors}
                        />
                    </Link>
                ))}
            </div>
            <AccountMenu image={user?.image} name={user?.name} id={user?.id} />
        </div>
    );
}
