"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  InputLabel,
  Select,
  MenuItem,
  Button,
  SelectChangeEvent,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { Movie, Rating } from "@/app/lib/definitions";
import { getRatings, getMovie } from "@/app/lib/actions";
import { useUserStore } from "@/app/stores/user-store";
import BackButton from "@/app/components/back-button";
import AccountMenu from "@/app/components/account-menu";
import { Badge } from "@/app/components/badge";
import ChevronUpIcon from "@/app/components/icons/chevron-up-icon";
import AdjustmentsHorizontalIcon from "@/app/components/icons/adjustments-horizontal-icon";
import ArrowsUpDownIcon from "@/app/components/icons/arrows-up-down-icon";
import MovieCard from "@/app/components/movie-card";
import FilteringModal from "@/app/components/filtering-modal";

export default function Ratings() {
  const { id } = useParams();
  const { user } = useUserStore((state) => state);
  const [ratedMovies, setRatedMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [value, setValue] = useState("Alphabetical");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [releaseYearFrom, setReleaseYearFrom] = useState<number | null>(null);
  const [releaseYearTo, setReleaseYearTo] = useState<number | null>(null);
  const [ratingFrom, setRatingFrom] = useState<number | null>(null);
  const [ratingTo, setRatingTo] = useState<number | null>(null);
  const [votesFrom, setVotesFrom] = useState<number | null>(null);
  const [votesTo, setVotesTo] = useState<number | null>(null);

  const filteringModalRef = useRef(null);

  function handleChange(event: SelectChangeEvent) {
    const newValue = event.target.value;
    setValue(newValue);
    setSortOrder("desc");
    sortMovies(filteredMovies, newValue, "desc");
  }

  function toggleSortOrder() {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    sortMovies(filteredMovies, value, newSortOrder);
  }

  function sortByAlphabet(movies: Movie[], order: "asc" | "desc") {
    setFilteredMovies(
      order === "desc"
        ? movies.toSorted((a, b) => a.Title.localeCompare(b.Title))
        : movies.toSorted((a, b) => b.Title.localeCompare(a.Title))
    );
  }

  function sortByIMDbRating(movies: Movie[], order: "asc" | "desc") {
    setFilteredMovies(
      order === "asc"
        ? movies.toSorted((a, b) => +a.imdbRating - +b.imdbRating)
        : movies.toSorted((a, b) => +b.imdbRating - +a.imdbRating)
    );
  }

  function sortByIMDbVotes(movies: Movie[], order: "asc" | "desc") {
    setFilteredMovies(
      order === "asc"
        ? movies.toSorted(
            (a, b) =>
              +a.imdbVotes.replace(/,/g, "") - +b.imdbVotes.replace(/,/g, "")
          )
        : movies.toSorted(
            (a, b) =>
              +b.imdbVotes.replace(/,/g, "") - +a.imdbVotes.replace(/,/g, "")
          )
    );
  }

  function sortByReleaseDate(movies: Movie[], order: "asc" | "desc") {
    setFilteredMovies(
      order === "asc"
        ? movies.toSorted((a, b) => +a.Year - +b.Year)
        : movies.toSorted((a, b) => +b.Year - +a.Year)
    );
  }

  function sortByRuntime(movies: Movie[], order: "asc" | "desc") {
    setFilteredMovies(
      order === "asc"
        ? movies.toSorted(
            (a, b) => +a.Runtime.split(" ")[0] - +b.Runtime.split(" ")[0]
          )
        : movies.toSorted(
            (a, b) => +b.Runtime.split(" ")[0] - +a.Runtime.split(" ")[0]
          )
    );
  }

  function sortMovies(
    movies: Movie[],
    sortType: string,
    sortOrder: "asc" | "desc"
  ) {
    switch (sortType) {
      case "Alphabetical":
        sortByAlphabet(movies, sortOrder);
        break;
      case "IMDb rating":
        sortByIMDbRating(movies, sortOrder);
        break;
      case "Number of ratings":
        sortByIMDbVotes(movies, sortOrder);
        break;
      case "Release date":
        sortByReleaseDate(movies, sortOrder);
        break;
      case "Runtime":
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

  function showFilters(filters: Map<string, string[] | number>) {
    filters.forEach((value, key) => {
      switch (key) {
        case "genres":
          setGenres(value as string[]);
          break;
        case "types":
          setTypes(value as string[]);
          break;
        case "releaseYearFrom":
          setReleaseYearFrom(value as number);
          break;
        case "releaseYearTo":
          setReleaseYearTo(value as number);
          break;
        case "ratingFrom":
          setRatingFrom(value as number);
          break;
        case "ratingTo":
          setRatingTo(value as number);
          break;
        case "votesFrom":
          setVotesFrom(value as number);
          break;
        case "votesTo":
          setVotesTo(value as number);
          break;
        default:
          break;
      }
    });
  }

  function handleDelete(filter: string) {
    switch (filter) {
      case "genres":
        setGenres([]);
        break;
      case "types":
        setTypes([]);
        break;
      case "releaseYearFrom":
        setReleaseYearFrom(null);
        break;
      case "releaseYearTo":
        setReleaseYearTo(null);
        break;
      case "ratingFrom":
        setRatingFrom(null);
        break;
      case "ratingTo":
        setRatingTo(null);
        break;
      case "votesFrom":
        setVotesFrom(null);
        break;
      case "votesTo":
        setVotesTo(null);
        break;
      default:
        break;
    }

    const updatedFilters = {
      genres: filter === "genres" ? [] : genres,
      types: filter === "types" ? [] : types,
      releaseYearFrom: filter === "releaseYearFrom" ? null : releaseYearFrom,
      releaseYearTo: filter === "releaseYearTo" ? null : releaseYearTo,
      ratingFrom: filter === "ratingFrom" ? null : ratingFrom,
      ratingTo: filter === "ratingTo" ? null : ratingTo,
      votesFrom: filter === "votesFrom" ? null : votesFrom,
      votesTo: filter === "votesTo" ? null : votesTo,
    };

    const filteredMovies = ratedMovies.filter((movie) => {
      const movieGenres = movie.Genre.split(", ");
      const movieType = movie.Type;
      const releaseYear = parseInt(movie.Year);
      const imdbRating = parseFloat(movie.imdbRating);
      const imdbVotes = parseInt(movie.imdbVotes.replace(/,/g, ""));

      const genreMatch =
        !updatedFilters.genres.length ||
        updatedFilters.genres.some((genre) => movieGenres.includes(genre));
      const typeMatch =
        !updatedFilters.types.length ||
        updatedFilters.types.some(
          (type) => type.toLowerCase() === movieType.toLowerCase()
        );
      const releaseYearMatch =
        (!updatedFilters.releaseYearFrom ||
          releaseYear >= updatedFilters.releaseYearFrom) &&
        (!updatedFilters.releaseYearTo ||
          releaseYear <= updatedFilters.releaseYearTo);
      const ratingMatch =
        (!updatedFilters.ratingFrom ||
          imdbRating >= updatedFilters.ratingFrom) &&
        (!updatedFilters.ratingTo || imdbRating <= updatedFilters.ratingTo);
      const votesMatch =
        (!updatedFilters.votesFrom || imdbVotes >= updatedFilters.votesFrom) &&
        (!updatedFilters.votesTo || imdbVotes <= updatedFilters.votesTo);

      return (
        genreMatch && typeMatch && releaseYearMatch && ratingMatch && votesMatch
      );
    });

    setFilteredMovies(filteredMovies);
    applyFilters(filteredMovies);
  }

  function resetFilters() {
    setGenres([]);
    setTypes([]);
    setReleaseYearFrom(null);
    setReleaseYearTo(null);
    setRatingFrom(null);
    setRatingTo(null);
    setVotesFrom(null);
    setVotesTo(null);
  }

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    async function fetchRatings() {
      const ratings = await getRatings(typeof id === "string" ? id : id[0]);
      const movies = await Promise.all(
        ratings.map(async (r: Rating) => {
          const movie = await getMovie(r.movieID);
          return movie;
        })
      );
      setRatedMovies(movies);
      setFilteredMovies(movies);
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

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <div className="absolute top-8 left-8 max-sm:top-4 max-sm:left-0">
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
      <Box className="flex items-center justify-center mt-4 -mb-8 max-sm:mt-12">
        <Button onClick={openModal}>
          <AdjustmentsHorizontalIcon />
        </Button>
        <Box className="max-sm:flex max-sm:flex-row max-sm:-mx-1">
          <InputLabel>Sort by</InputLabel>
        </Box>
        <Select value={value} onChange={handleChange} className="m-2">
          <MenuItem value="Alphabetical">Alphabetical</MenuItem>
          <MenuItem value="IMDb rating">IMDb rating</MenuItem>
          <MenuItem value="Number of ratings">Number of ratings</MenuItem>
          <MenuItem value="Release date">Release date</MenuItem>
          <MenuItem value="Runtime">Runtime</MenuItem>
        </Select>
        <Button onClick={toggleSortOrder}>
          <ArrowsUpDownIcon />
        </Button>
      </Box>
      <div className="flex flex-col items-center justify-center">
        {filteredMovies ? (
          <>
            <Box className="mt-8 -mb-10">
              <Typography variant="subtitle1">
                {`${
                  filteredMovies.length === 1
                    ? "1 title"
                    : `${filteredMovies.length} titles`
                }`}
              </Typography>
            </Box>
            <Box className="mt-10 mb-2 flex justify-center gap-2 max-w-96 flex-wrap max-sm:max-w-80">
              {genres.map((genre) => (
                <Chip
                  key={genre}
                  label={`${genre}`}
                  onDelete={() => handleDelete("genres")}
                  className="hover:cursor-pointer hover:bg-neutral-300"
                />
              ))}
              {types.map((type) => (
                <Chip
                  key={type}
                  label={type}
                  onDelete={() => handleDelete("types")}
                  className="hover:cursor-pointer hover:bg-neutral-300"
                />
              ))}
              {releaseYearFrom && (
                <Chip
                  label={`Release year: before ${releaseYearFrom}`}
                  onDelete={() => handleDelete("releaseYearFrom")}
                  className="hover:cursor-pointer hover:bg-neutral-300"
                />
              )}
              {releaseYearTo && (
                <Chip
                  label={`Release year: after ${releaseYearTo}`}
                  onDelete={() => handleDelete("releaseYearTo")}
                  className="hover:cursor-pointer hover:bg-neutral-300"
                />
              )}
              {ratingFrom && (
                <Chip
                  label={`User rating: ${ratingFrom} or above`}
                  onDelete={() => handleDelete("ratingFrom")}
                  className="hover:cursor-pointer hover:bg-neutral-300"
                />
              )}
              {ratingTo && (
                <Chip
                  label={`User rating: ${ratingTo} or below`}
                  onDelete={() => handleDelete("ratingTo")}
                  className="hover:cursor-pointer hover:bg-neutral-300"
                />
              )}
              {votesFrom && (
                <Chip
                  label={`Number of votes: ${votesFrom} or above`}
                  onDelete={() => handleDelete("votesFrom")}
                  className="hover:cursor-pointer hover:bg-neutral-300"
                />
              )}
              {votesTo && (
                <Chip
                  label={`Number of votes: ${votesTo} or below`}
                  onDelete={() => handleDelete("votesTo")}
                  className="hover:cursor-pointer hover:bg-neutral-300"
                />
              )}
            </Box>
            {filteredMovies.map((movie: Movie) => (
              <Link href={`/title/${movie.imdbID}`} key={movie.imdbID}>
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
      <Box className="max-sm:absolute max-sm:left-[21.5rem] max-sm:-top-1">
        <AccountMenu image={user?.image} name={user?.name} id={user?.id} />
      </Box>
      <FilteringModal
        ref={filteringModalRef}
        open={isModalOpen}
        movies={ratedMovies}
        onApplyFilters={applyFilters}
        onShowFilters={showFilters}
        onDeleteFilter={handleDelete}
        onResetFilters={resetFilters}
        onClose={closeModal}
      />
    </div>
  );
}
