import { memo } from 'react';
import Image from 'next/image';
import { convertToHoursAndMinutes } from '@/app/lib/utils';
import { Separator } from '@/app/components/separator';
import { CardContent, Card } from '@/app/components/card'
import CameraIcon from '@/app/components/icons/camera-icon';
import StarIcon from '@/app/components/icons/star-icon';

function MovieCard({
    poster,
    title,
    imdbRating,
    year,
    rated,
    runtime,
    plot,
    director,
    actors,
}: {
    poster: string;
    title: string;
    imdbRating: string;
    year: string;
    rated: string;
    runtime: string;
    plot: string;
    director: string;
    actors: string;
}) {
    return (
        <Card className="w-full max-w-sm rounded-lg overflow-hidden shadow-xl mb-8 mx-8
        hover:border-blue-400
        active:border-blue-400 active:border-dashed
        dark:shadow-none">
            <div className="relative">
                <div className="relative w-full">
                    <Image
                        src={poster}
                        alt={title || 'Movie Poster'}
                        width={500}
                        height={750}
                        sizes="100%"
                        priority
                    />
                </div>
                <div className="flex items-center justify-center absolute top-4 left-4 bg-gray-900 text-white px-2 py-1 rounded-md text-sm font-medium">
                    {imdbRating}
                    <StarIcon className="w-4 h-4 inline-block align-middle" />
                </div>
            </div>
            <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                        <span>{year}</span>
                        <Separator className="mx-2 h-4" orientation="vertical" />
                        <span>{rated}</span>
                        <Separator className="mx-2 h-4" orientation="vertical" />
                        <span>{convertToHoursAndMinutes(runtime)}</span>
                    </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {plot}
                </p>
                <div className="flex items-center gap-2">
                    <CameraIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">{director}</span>
                </div>
                <div className="flex items-center gap-2">
                    <StarIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {actors}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}

export default memo(MovieCard);
