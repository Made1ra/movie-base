'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import type { Movie, Watchlist } from '@/app/lib/definitions';
import { getWatchlist, getMovie } from '@/app/lib/actions';
import { useUserStore } from '@/app/stores/user-store';
import BackButton from '@/app/components/back-button';
import AccountMenu from '@/app/components/account-menu';
import { Badge } from '@/app/components/badge';
import ChevronUpIcon from '@/app/components/chevron-up-icon';
import MovieCard from '@/app/components/movie-card';

export default function Watchlist() {
    const { id } = useParams();
    const { user } = useUserStore((state) => state);
    const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
    const [showBackToTop, setShowBackToTop] = useState(false);

    const scrollToTop = useCallback(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, []);

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

    useEffect(() => {
        function handleScroll() {
            if (window.scrollY > 100) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div>
            <div className="absolute top-8 left-8">
                <BackButton />
            </div>
            {showBackToTop && (
                <Badge
                    onClick={scrollToTop}
                    className="z-10 fixed top-4 left-[55rem] px-2 py-1 bg-neutral-50 text-black rounded-xl cursor-pointer shadow-xl text-base
                    hover:bg-neutral-300 hover:text-black"
                >
                    <ChevronUpIcon className="w-6 h-6 mr-2" />
                    Back to top
                </Badge>
            )}
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
