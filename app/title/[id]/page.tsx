"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { nanoid } from "nanoid";
import {
  Typography,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
} from "@mui/material";
import { Movie } from "@/app/lib/definitions";
import {
  getMovie,
  getTitleInfo,
  postWatchlist,
  deleteWatchlist,
} from "@/app/lib/actions";
import { convertToHoursAndMinutes, formatNumber } from "@/app/lib/utils";
import { useUserStore } from "@/app/stores/user-store";
import { useWatchlistStore } from "@/app/stores/watchlist-store";
import { useRatingsStore } from "@/app/stores/ratings-store";
import BackButton from "@/app/components/back-button";
import AccountMenu from "@/app/components/account-menu";
import StarIcon from "@/app/components/icons/star-icon";
import ModalRating from "@/app/components/modal-rating";
import ChevronRightIcon from "@/app/components/icons/chevron-right-icon";
import CheckIcon from "@/app/components/icons/check-icon";
import PlusIcon from "@/app/components/icons/plus-icon";

export default function Title() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [value, setValue] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const { id } = useParams();

  const { user } = useUserStore((state) => state);
  const { watchlist, addToWatchlist, removeFromWatchlist } = useWatchlistStore(
    (state) => state
  );
  const { addRating } = useRatingsStore((state) => state);

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function addMovieToWatchlist(imdbID: string) {
    addToWatchlist(nanoid(), user?.id || "", imdbID);
    postWatchlist(nanoid(), user?.id || "", imdbID);
  }

  function removeMovieFromWatchlist(imdbID: string) {
    const id = watchlist.find((w) => w.movieID === imdbID)?.id;
    if (id) {
      removeFromWatchlist(id);
      deleteWatchlist(id, user?.id || "");
    }
  }

  useEffect(() => {
    async function fetchMovie() {
      const fetchedMovie = await getMovie(id);
      setMovie(fetchedMovie);
    }

    fetchMovie();
  }, [id, user?.id]);

  useEffect(() => {
    async function fetchInfo() {
      const data = await getTitleInfo(
        typeof id === "string" ? id : id[0],
        user?.id || ""
      );
      if (data.watchlist) {
        addToWatchlist(
          data.watchlist.id,
          data.watchlist.userID,
          data.watchlist.movieID
        );
      }

      if (data.rating) {
        setValue(data.rating.rating);
        addRating(
          data.rating.id,
          data.rating.userID,
          data.rating.movieID,
          data.rating.rating
        );
      }
    }

    fetchInfo();
  }, [addRating, addToWatchlist, id, user?.id]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="absolute top-8 left-8 max-sm:top-[3.75rem] max-sm:left-0">
        <BackButton />
      </div>
      <Box className="max-sm:relative max-sm:left-44 max-sm:top-10">
        <AccountMenu image={user?.image} name={user?.name} id={user?.id} />
      </Box>
      <div className="flex flex-col gap-2">
        <Box className="flex justify-center">
          <Typography variant="h3">{movie?.Title}</Typography>
        </Box>
        <ul className="flex flex-row justify-center items-center gap-8">
          <li>
            <Typography variant="body2">{movie?.Year}</Typography>
          </li>
          <li className="list-disc -mt-1">
            <Typography variant="body2">{movie?.Rated}</Typography>
          </li>
          <li className="list-disc -mt-1">
            <Typography variant="body2">
              {convertToHoursAndMinutes(movie?.Runtime || "")}
            </Typography>
          </li>
        </ul>
        <div className="flex flex-row justify-center items-start gap-4">
          <div className="flex flex-col justify-center items-center">
            <Typography variant="body2">IMDb RATING</Typography>
            <div className="flex flex-row justify-center items-center">
              <StarIcon className="w-6 h-6" fill="#fbbf24" stroke="#fbbf24" />
              <div className="flex flex-col">
                <Typography variant="h5">{movie?.imdbRating}/10</Typography>
                <Typography variant="body2">
                  {formatNumber(movie?.imdbVotes || "")}
                </Typography>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <Typography variant="body2">YOUR RATING</Typography>
            <button
              className="flex flex-row justify-center items-center gap-1 mt-2"
              onClick={handleOpen}
            >
              <StarIcon className="w-6 h-6" fill={value ? "#3b82f6" : "#fff"} />
              <Typography variant="h5">
                {value ? `${value}/10` : "Rate"}
              </Typography>
            </button>
          </div>
        </div>
      </div>
      <div className="relative w-full my-2 flex items-center justify-center">
        {movie?.Poster && (
          <Image
            src={movie?.Poster}
            alt={movie?.Title || "Movie Poster"}
            width={300}
            height={450}
            sizes="100%"
            priority
            className="rounded-sm"
          />
        )}
      </div>
      <div className="flex flex-row gap-2 my-2">
        {movie?.Genre.split(", ").map((genre, index) => (
          <Chip key={index} label={genre} variant="outlined" />
        ))}
      </div>
      <Typography variant="h5" className="max-w-96 max-sm:w-72">
        {movie?.Plot}
      </Typography>
      <Box className="w-[25rem] max-sm:flex max-sm:items-center max-sm:justify-center">
        <Divider className="max-sm:w-72" />
      </Box>
      <List>
        <ListItem className="gap-4">
          <ListItemText primary="Director" />
          <ListItemText secondary={movie?.Director} />
        </ListItem>
        <Box className="max-sm:flex max-sm:items-center max-sm:justify-center">
          <Divider className="max-sm:w-72" />
        </Box>
        <ListItem className="gap-4">
          <ListItemText primary="Writer" />
          <ListItemText secondary={movie?.Writer} />
        </ListItem>
        <Box className="max-sm:flex max-sm:items-center max-sm:justify-center">
          <Divider className="max-sm:w-72" />
        </Box>
        <ListItem className="gap-4">
          <ListItemText primary="Actors" />
          <ListItemText secondary={movie?.Actors} />
        </ListItem>
        <Box className="max-sm:flex max-sm:items-center max-sm:justify-center">
          <Divider className="max-sm:w-72" />
        </Box>
      </List>
      {movie?.Awards !== "N/A" && (
        <Box
          className="bg-amber-400 flex justify-between items-center p-4 rounded
                max-sm:w-72"
        >
          <div className="flex justify-center items-center space-x-4">
            {movie?.Awards.split(".").map((award, index) => (
              <Typography
                key={index}
                variant="subtitle1"
                className="hover:cursor-pointer"
              >
                <span className={`${index === 0 && "font-bold"}`}>{award}</span>
              </Typography>
            ))}
          </div>
          <ChevronRightIcon className="text-black ml-4 hover:cursor-pointer" />
        </Box>
      )}
      {watchlist.find((w) => w.movieID === movie?.imdbID) ? (
        <Button
          startIcon={<CheckIcon />}
          onClick={() => removeMovieFromWatchlist(movie?.imdbID || "")}
        >
          <span className="-mb-1">In Watchlist</span>
        </Button>
      ) : (
        <Button
          startIcon={<PlusIcon />}
          onClick={() => addMovieToWatchlist(movie?.imdbID || "")}
        >
          <span className="-mb-1">Add to Watchlist</span>
        </Button>
      )}
      {movie?.Metascore && (
        <div className="flex flex-row justify-center items-center gap-1 mb-4 hover:cursor-pointer">
          <span
            className={`text-white text-xl font-bold p-1
                        ${+movie.Metascore < 40 && "bg-red-400"}
                        ${+movie.Metascore < 60 && "bg-amber-400"}
                        ${+movie.Metascore > 59 && "bg-green-400"}`}
          >
            {movie?.Metascore}
          </span>
          <Typography variant="h5">Metascore</Typography>
        </div>
      )}
      <ModalRating
        open={open}
        onClose={handleClose}
        title={movie?.Title || ""}
        movieID={movie?.imdbID || ""}
        rating={value}
        setRating={setValue}
      />
    </div>
  );
}
