'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { InputLabel, Select, MenuItem, Button, SelectChangeEvent, Typography, Box } from '@mui/material';
import type { Movie, Watchlist } from '@/app/lib/definitions';
import { getWatchlist, getMovie } from '@/app/lib/actions';
import { useUserStore } from '@/app/stores/user-store';
import BackButton from '@/app/components/back-button';
import AccountMenu from '@/app/components/account-menu';
import { Badge } from '@/app/components/badge';
import ChevronUpIcon from '@/app/components/icons/chevron-up-icon';
import AdjustmentsHorizontalIcon from '@/app/components/icons/adjustments-horizontal-icon';
import ArrowsUpDownIcon from '@/app/components/icons/arrows-up-down-icon';
import MovieCard from '@/app/components/movie-card';
import FilteringModal from '@/app/components/filtering-modal';

export default function Watchlist() {
    const { id } = useParams();
    const { user } = useUserStore((state) => state);
    const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
    const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
    const [value, setValue] = useState('Alphabetical');
    const [isModalOpen, setIsModalOpen] = useState(false);

    function handleChange(event: SelectChangeEvent) {
        const newValue = event.target.value;
        setValue(newValue);
        setSortOrder('desc');
        sortMovies(filteredMovies, newValue, 'desc');
    }

    function toggleSortOrder() {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
        sortMovies(filteredMovies, value, newSortOrder);
    }

    function sortByAlphabet(movies: Movie[], order: 'asc' | 'desc') {
        setFilteredMovies(order === 'desc'
            ? movies.toSorted((a, b) => a.Title.localeCompare(b.Title))
            : movies.toSorted((a, b) => b.Title.localeCompare(a.Title))
        );
    }

    function sortByIMDbRating(movies: Movie[], order: 'asc' | 'desc') {
        setFilteredMovies(order === 'asc'
            ? movies.toSorted((a, b) => +a.imdbRating - +b.imdbRating)
            : movies.toSorted((a, b) => +b.imdbRating - +a.imdbRating)
        );
    }

    function sortByIMDbVotes(movies: Movie[], order: 'asc' | 'desc') {
        setFilteredMovies(order === 'asc'
            ? movies.toSorted((a, b) => +a.imdbVotes.replace(/,/g, '') - +b.imdbVotes.replace(/,/g, ''))
            : movies.toSorted((a, b) => +b.imdbVotes.replace(/,/g, '') - +a.imdbVotes.replace(/,/g, ''))
        );
    }

    function sortByReleaseDate(movies: Movie[], order: 'asc' | 'desc') {
        setFilteredMovies(order === 'asc'
            ? movies.toSorted((a, b) => +a.Year - +b.Year)
            : movies.toSorted((a, b) => +b.Year - +a.Year)
        );
    }

    function sortByRuntime(movies: Movie[], order: 'asc' | 'desc') {
        setFilteredMovies(order === 'asc'
            ? movies.toSorted((a, b) => +a.Runtime.split(' ')[0] - +b.Runtime.split(' ')[0])
            : movies.toSorted((a, b) => +b.Runtime.split(' ')[0] - +a.Runtime.split(' ')[0])
        );
    }

    function sortMovies(movies: Movie[], sortType: string, sortOrder: 'asc' | 'desc') {
        switch (sortType) {
            case 'Alphabetical':
                sortByAlphabet(movies, sortOrder);
                break;
            case 'IMDb rating':
                sortByIMDbRating(movies, sortOrder);
                break;
            case 'Number of ratings':
                sortByIMDbVotes(movies, sortOrder);
                break;
            case 'Release date':
                sortByReleaseDate(movies, sortOrder);
                break;
            case 'Runtime':
                sortByRuntime(movies, sortOrder);
                break;
            default:
                break;
        }
    }

    function openModal() {
        setIsModalOpen(true);
    }

    function closeModal() {
        setIsModalOpen(false);
    }

    function applyFilters(filteredMovies: Movie[]) {
        sortMovies(filteredMovies, value, sortOrder);
    }

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
            setFilteredMovies(movies);
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
            <div className="flex items-center justify-center mt-4 -mb-8">
                <Button onClick={openModal}>
                    <AdjustmentsHorizontalIcon />
                </Button>
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
                {filteredMovies ? (
                    <>
                        <Box className="mt-6 -mb-10">
                            <Typography variant="subtitle1">
                                {`${filteredMovies.length === 1 ? '1 title' : `${filteredMovies.length} titles`}`}
                            </Typography>
                        </Box>
                        {filteredMovies.map((movie: Movie) => (
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
                    </>
                ) : (
                    <Typography variant="h6" gutterBottom>
                        No movies found
                    </Typography>
                )}
            </div>
            <AccountMenu
                image={user?.image}
                name={user?.name}
                id={user?.id}
            />
            <FilteringModal
                open={isModalOpen}
                movies={watchlistMovies}
                onApplyFilters={applyFilters}
                onClose={closeModal}
            />
        </div>
    );
}
