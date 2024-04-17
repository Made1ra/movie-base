'use client';

import { useState, useEffect, SyntheticEvent } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Typography, Chip, Divider, List, ListItem, ListItemText, Button } from '@mui/material';
import { Movie } from '@/app/lib/definitions';
import { getMovie } from '@/app/lib/actions';
import { convertToHoursAndMinutes, formatNumber } from '@/app/lib/utils';
import StarIcon from '@/app/components/star-icon';
import ModalRating from '@/app/components/modal-rating';
import ChevronRightIcon from '@/app/components/chevron-right-icon';
import PlusIcon from '@/app/components/plus-icon';
import BackButton from '@/app/components/back-button';

export default function Title() {
    const [movie, setMovie] = useState<Movie | null>(null);
    const [value, setValue] = useState<number | null>(null);
    const [open, setOpen] = useState(false);
    const { id } = useParams();

    function handleChange(_: SyntheticEvent<Element, Event>, newValue: number | null) {
        setValue(newValue);
    }

    function handleOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    useEffect(() => {
        async function fetchMovie() {
            const fetchedMovie = await getMovie(id);
            setMovie(fetchedMovie);
        }

        fetchMovie();
    }, [id]);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen">
            <div className="absolute top-8 left-8">
                <BackButton />
            </div>
            <div className="flex flex-col gap-2">
                <Typography variant="h3">{movie?.Title}</Typography>
                <ul className="flex flex-row justify-center items-center gap-8">
                    <li>
                        <Typography variant="body2">{movie?.Year}</Typography>
                    </li>
                    <li className="list-disc -mt-1">
                        <Typography variant="body2">{movie?.Rated}</Typography>
                    </li>
                    <li className="list-disc -mt-1">
                        <Typography variant="body2">{convertToHoursAndMinutes(movie?.Runtime || '')}</Typography>
                    </li>
                </ul>
                <div className="flex flex-row justify-center items-start gap-4">
                    <div className="flex flex-col justify-center items-center">
                        <Typography variant="body2">IMDb RATING</Typography>
                        <div className="flex flex-row justify-center items-center">
                            <StarIcon className="w-6 h-6" fill="#fbbf24" stroke="#fbbf24" />
                            <div className="flex flex-col">
                                <Typography variant="h5">{movie?.imdbRating}/10</Typography>
                                <Typography variant="body2">{formatNumber(movie?.imdbVotes || '')}</Typography>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <Typography variant="body2">YOUR RATING</Typography>
                        <button className="flex flex-row justify-center items-center gap-1 mt-2" onClick={handleOpen}>
                            <StarIcon className="w-6 h-6" fill={value ? '#3b82f6' : '#fff'} />
                            <Typography variant="h5">{value ? `${value}/10` : 'Rate'}</Typography>
                        </button>
                    </div>
                </div>
            </div>
            <div className="relative w-80 h-96 my-2">
                <Image
                    src={movie?.Poster || ''}
                    alt={movie?.Title || ''}
                    fill
                    sizes="100%"
                    priority
                    className="rounded-sm"
                />
            </div>
            <div className="flex flex-row gap-2 my-2">
                {movie?.Genre
                    .split(', ')
                    .map((genre, index) => (
                        <Chip key={index} label={genre} variant="outlined" />
                    ))}
            </div>
            <Typography variant="h5" className="max-w-96">{movie?.Plot}</Typography>
            <Divider />
            <List>
                <ListItem className="gap-4">
                    <ListItemText primary="Director" />
                    <ListItemText secondary={movie?.Director} />
                </ListItem>
                <Divider />
                <ListItem className="gap-4">
                    <ListItemText primary="Writer" />
                    <ListItemText secondary={movie?.Writer} />
                </ListItem>
                <Divider />
                <ListItem className="gap-4">
                    <ListItemText primary="Actors" />
                    <ListItemText secondary={movie?.Actors} />
                </ListItem>
                <Divider />
            </List>
            {movie?.Awards !== 'N/A' && (
                <div className="bg-amber-400 flex justify-between items-center p-4 rounded">
                    <div className="flex justify-center items-center space-x-4">
                        {movie?.Awards
                            .split('.')
                            .map((award, index) => (
                                <Typography
                                    key={index}
                                    variant="subtitle1"
                                    className="hover:cursor-pointer"
                                >
                                    <span className={`${index === 0 && 'font-bold'}`}>
                                        {award}
                                    </span>
                                </Typography>
                            ))}
                    </div>
                    <ChevronRightIcon className="text-black ml-4 hover:cursor-pointer" />
                </div>
            )}
            <Button startIcon={<PlusIcon />} onClick={undefined}>
                <span className="-mb-1">Add to Watchlist</span>
            </Button>
            {movie?.Metascore && (
                <div className="flex flex-row justify-center items-center gap-1 mb-4 hover:cursor-pointer">
                    <span
                        className={`text-white text-xl font-bold p-1
                        ${+movie.Metascore < 40 && 'bg-red-400'}
                        ${+movie.Metascore < 60 && 'bg-amber-400'}
                        ${+movie.Metascore > 59 && 'bg-green-400'}`}
                    >
                        {movie?.Metascore}
                    </span>
                    <Typography variant="h5">Metascore</Typography>
                </div>
            )}
            <ModalRating
                open={open}
                onClose={handleClose}
                title={movie?.Title || ''}
            />
        </div>
    );
}
