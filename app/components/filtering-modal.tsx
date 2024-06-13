'use client';

import { useState, memo } from 'react';
import { Modal, Box, Button, Chip, TextField, Slider, Typography } from '@mui/material';
import { Movie } from '@/app/lib/definitions';
import { getGenres, getTypes } from '@/app/lib/utils';

function FilteringModal({
    open,
    movies,
    onApplyFilters,
    onClose,
}: {
    open: boolean;
    movies: Movie[];
    onApplyFilters: (filteredMovies: Movie[]) => void;
    onClose: () => void;
}) {
    const genres = getGenres(movies);
    const types = getTypes(movies);
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [releaseYearFrom, setReleaseYearFrom] = useState<number | null>(null);
    const [releaseYearTo, setReleaseYearTo] = useState<number | null>(null);
    const [ratingFrom, setRatingFrom] = useState<number | null>(null);
    const [ratingTo, setRatingTo] = useState<number | null>(null);
    const [votesFrom, setVotesFrom] = useState<number | null>(null);
    const [votesTo, setVotesTo] = useState<number | null>(null);

    function handleApplyFilters() {
        const filteredMovies = movies.filter(movie => {
            const movieGenres = movie.Genre.split(', ');
            const movieType = movie.Type;
            const releaseYear = parseInt(movie.Year);
            const imdbRating = parseFloat(movie.imdbRating);
            const imdbVotes = parseInt(movie.imdbVotes.replace(/,/g, ''));

            const genreMatch = selectedGenres.length === 0 || selectedGenres.some(genre => movieGenres.includes(genre.split(' ')[0]));
            const typeMatch = selectedTypes.length === 0 || selectedTypes.some(type => type.split(' ')[0].toLowerCase() === movieType.toLowerCase());
            const releaseYearMatch = (!releaseYearFrom || releaseYear >= releaseYearFrom) && (!releaseYearTo || releaseYear <= releaseYearTo);
            const ratingMatch = (!ratingFrom || imdbRating >= ratingFrom) && (!ratingTo || imdbRating <= ratingTo);
            const votesMatch = (!votesFrom || imdbVotes >= votesFrom) && (!votesTo || imdbVotes <= votesTo);

            return genreMatch && typeMatch && releaseYearMatch && ratingMatch && votesMatch;
        });
        
        onApplyFilters(filteredMovies);
        onClose();
    }

    function resetFilters() {
        onApplyFilters(movies);
        onClose();
    }

    if (!open) {
        return null;
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
        >
            <Box className="flex flex-col items-center mt-20 bg-zinc-50 p-4 w-[26rem] rounded shadow-lg absolute left-[50%] translate-x-[-50%]">
                <Button
                    onClick={onClose}
                    className="font-bold text-xl absolute -top-4 left-48 rounded-full
                    hover:bg-zinc-50"
                >
                    X
                </Button>
                <Box className="w-full">
                    <Typography variant="h6" gutterBottom>
                        Genres
                    </Typography>
                    <Box className="flex flex-wrap gap-1 mb-4">
                        {genres.map((genre) => (
                            <Chip
                                key={genre}
                                label={genre}
                                onClick={() => setSelectedGenres((prev) => prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre])}
                                color={selectedGenres.includes(genre) ? 'primary' : 'default'}
                                className="hover:cursor-pointer hover:bg-neutral-300"
                            />
                        ))}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                        Title Type
                    </Typography>
                    <Box className="flex flex-wrap gap-1 mb-4">
                        {types.map((type) => (
                            <Chip
                                key={type}
                                label={type}
                                onClick={() => setSelectedTypes((prev) => prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type])}
                                color={selectedTypes.includes(type) ? 'primary' : 'default'}
                                className="hover:cursor-pointer hover:bg-neutral-300"
                            />
                        ))}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                        Release Year
                    </Typography>
                    <Box className="flex gap-2 mb-4">
                        <TextField
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={releaseYearFrom || ''}
                            onChange={(event) => setReleaseYearFrom(event.target.value ? parseInt(event.target.value) : null)}
                            inputProps={{ min: 0 }}
                        />
                        <span className="flex items-center">to</span>
                        <TextField
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={releaseYearTo || ''}
                            onChange={(event) => setReleaseYearTo(event.target.value ? parseInt(event.target.value) : null)}
                            inputProps={{ min: 0 }}
                        />
                    </Box>
                    <Typography variant="h6" gutterBottom>
                        IMDb Ratings
                    </Typography>
                    <Typography variant="subtitle1">
                        User Rating
                    </Typography>
                    <Box className="flex gap-2 mb-4">
                        <TextField
                            type="number"
                            label="1.0"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={ratingFrom || ''}
                            onChange={(event) => setRatingFrom(parseFloat(event.target.value))}
                            inputProps={{ min: 1, max: 10 }}
                        />
                        <span className="flex items-center">to</span>
                        <TextField
                            type="number"
                            label="10.0"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={ratingTo || ''}
                            onChange={(event) => setRatingTo(parseFloat(event.target.value))}
                            inputProps={{ min: 1, max: 10 }}
                        />
                    </Box>
                    <Typography variant="subtitle1">
                        Number of Votes
                    </Typography>
                    <Box className="flex gap-2 mb-4">
                        <TextField
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={votesFrom || ''}
                            onChange={(event) => setVotesFrom(event.target.value ? parseInt(event.target.value) : null)}
                        />
                        <span className="flex items-center">to</span>
                        <TextField
                            type="number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={votesTo || ''}
                            onChange={(event) => setVotesTo(event.target.value ? parseInt(event.target.value) : null)}
                        />
                    </Box>
                    <Box className="flex gap-4">
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleApplyFilters}
                        >
                            Apply Filters
                        </Button>
                        <Button
                            variant="contained"
                            color="inherit"
                            onClick={resetFilters}
                        >
                            Reset Filters
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
}

export default memo(FilteringModal);
