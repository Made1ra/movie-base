'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Movie, Rating } from '@/app/lib/definitions';
import { getRatings, getMovie } from '@/app/lib/actions';
import { useUserStore } from '@/app/stores/user-store';
import BackButton from '@/app/components/back-button';
import AccountMenu from '@/app/components/account-menu';
import MovieCard from '@/app/components/movie-card';

export default function Ratings() {
    const { id } = useParams();
    const { user } = useUserStore((state) => state);
    const [ratings, setRatings] = useState<Movie[]>([]);

    useEffect(() => {
        async function fetchRatings() {
            const ratings = await getRatings(typeof id === 'string' ? id : id[0]);
            const movies = await Promise.all(ratings.map(async (r: Rating) => {
                const movie = await getMovie(r.movieID);
                return movie;
            }));
            setRatings(movies);
        }

        fetchRatings();
    }, [id]);

    return (
        <div>
            <div className="absolute top-8 left-8">
                <BackButton />
            </div>
            <div className="flex flex-col items-center justify-center mb-8">
                {ratings.map((movie: Movie) => (
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
