import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, Typography } from '@mui/material';
import { Movie } from '@/app/lib/definitions';
import { getMovies } from '@/app/lib/actions';

async function Movies({ query }: { query: string }) {
    const movies = await getMovies(query);

    return (
        <div>
            {movies && (
                <div className="flex flex-col justify-center items-center m-4">
                    {movies.map((movie: Movie) => (
                        <Link key={movie.imdbID} href={`/title/${movie.imdbID}`}>
                            <Card className="flex flex-col justify-center items-center mb-4 w-96 p-2 rounded shadow border
                            hover:border-blue-400
                            active:border-blue-400 active:border-dashed">
                                {movie.Poster === 'N/A' ? (
                                    <Typography>No poster available</Typography>
                                ) : (
                                    <div className="relative w-80 h-80">
                                        <Image
                                            src={movie.Poster}
                                            alt={movie.Title || ''}
                                            fill
                                            sizes="100%"
                                            priority
                                            className="rounded-sm shadow"
                                        />
                                    </div>
                                )}
                                <Typography variant="h3" className="text-center">{movie.Title}</Typography>
                                <Typography variant="h6" className="text-center">{movie.Year}</Typography>
                            </Card>
                        </Link>
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
