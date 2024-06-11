'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { InputLabel, Select, MenuItem, Button, SelectChangeEvent } from '@mui/material';
import { Movie, Rating } from '@/app/lib/definitions';
import { getRatings, getMovie } from '@/app/lib/actions';
import { useUserStore } from '@/app/stores/user-store';
import BackButton from '@/app/components/back-button';
import AccountMenu from '@/app/components/account-menu';
import { Badge } from '@/app/components/badge';
import ChevronUpIcon from '@/app/components/icons/chevron-up-icon';
import ArrowsUpDownIcon from '@/app/components/icons/arrows-up-down-icon';
import MovieCard from '@/app/components/movie-card';

export default function Ratings() {
    const { id } = useParams();
    const { user } = useUserStore((state) => state);
    const [ratings, setRatings] = useState<Movie[]>([]);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    const [value, setValue] = useState('Alphabetical');

    function handleChange(event: SelectChangeEvent) {
        const newValue = event.target.value;
        setValue(newValue);
        setSortOrder('desc');
        sortMovies(newValue, 'desc');
    }

    function toggleSortOrder() {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
        sortMovies(value, newSortOrder);
    }

    function sortMovies(sortType: string, sortOrder: 'asc' | 'desc') {
        switch (sortType) {
            case 'Alphabetical':
                sortByAlphabet(sortOrder);
                break;
            case 'IMDb rating':
                sortByIMDbRating(sortOrder);
                break;
            case 'Number of ratings':
                sortByIMDbVotes(sortOrder);
                break;
            case 'Release date':
                sortByReleaseDate(sortOrder);
                break;
            case 'Runtime':
                sortByRuntime(sortOrder);
                break;
            default:
                break;
        }
    }

    function sortByAlphabet(order: 'asc' | 'desc') {
        setRatings(order === 'asc'
            ? ratings.toSorted((a, b) => a.Title.localeCompare(b.Title))
            : ratings.toSorted((a, b) => b.Title.localeCompare(a.Title))
        );
    }

    function sortByIMDbRating(order: 'asc' | 'desc') {
        setRatings(order === 'asc'
            ? ratings.toSorted((a, b) => +a.imdbRating - +b.imdbRating)
            : ratings.toSorted((a, b) => +b.imdbRating - +a.imdbRating)
        );
    }

    function sortByIMDbVotes(order: 'asc' | 'desc') {
        setRatings(order === 'asc'
            ? ratings.toSorted((a, b) => +a.imdbVotes.replace(/,/g, '') - +b.imdbVotes.replace(/,/g, ''))
            : ratings.toSorted((a, b) => +b.imdbVotes.replace(/,/g, '') - +a.imdbVotes.replace(/,/g, ''))
        );
    }

    function sortByReleaseDate(order: 'asc' | 'desc') {
        setRatings(order === 'asc'
            ? ratings.toSorted((a, b) => +a.Year - +b.Year)
            : ratings.toSorted((a, b) => +b.Year - +a.Year)
        );
    }

    function sortByRuntime(order: 'asc' | 'desc') {
        setRatings(order === 'asc'
            ? ratings.toSorted((a, b) => +a.Runtime.split(' ')[0] - +b.Runtime.split(' ')[0])
            : ratings.toSorted((a, b) => +b.Runtime.split(' ')[0] - +a.Runtime.split(' ')[0])
        );
    }

    const scrollToTop = useCallback(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }, []);

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
            <div className="flex items-center justify-center -mb-8">
                <InputLabel>Sort by</InputLabel>
                <Select
                    value={value}
                    onChange={handleChange}
                    className="m-2"
                >
                    <MenuItem value="Alphabetical">Alphabetical</MenuItem>
                    <MenuItem value="IMDb rating">IMDb rating</MenuItem>
                    <MenuItem value="Number of ratings">Number of ratings</MenuItem>
                    <MenuItem value="Release date">Release date</MenuItem>
                    <MenuItem value="Runtime">Runtime</MenuItem>
                </Select>
                <Button onClick={toggleSortOrder}>
                    <ArrowsUpDownIcon />
                </Button>
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
