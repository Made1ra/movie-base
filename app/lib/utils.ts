import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Movie } from "./definitions";

export const convertToHoursAndMinutes = (min: string) => {
  const minutes = Number.parseInt(min, 10);

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  let result = "";
  if (hours > 0) {
    result += hours + "h ";
  }

  if (remainingMinutes > 0) {
    result += remainingMinutes + "m";
  }

  return result.trim();
};

export const formatNumber = (str: string) => {
  const number = parseFloat(str.replace(/,/g, ""));

  const K_THRESHOLD = 1000;
  const M_THRESHOLD = 1000000;

  if (number >= M_THRESHOLD) {
    const roundedNumber = (number / M_THRESHOLD).toFixed(1);
    return `${roundedNumber}M`;
  } else if (number >= K_THRESHOLD) {
    const roundedNumber = Math.round(number / K_THRESHOLD);
    return `${roundedNumber}K`;
  }

  return str;
};

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getGenres = (movies: Movie[]) => {
  const genreCounts: { [key: string]: number } = {};
  movies.forEach((movie) => {
    movie.Genre.split(", ").forEach((genre) => {
      if (genreCounts[genre]) {
        genreCounts[genre]++;
      } else {
        genreCounts[genre] = 1;
      }
    });
  });

  return Object.entries(genreCounts).map(
    ([genre, count]) => `${genre} (${count})`
  );
};

export const getTypes = (movies: Movie[]) => {
  const typeCounts: { [key: string]: number } = {};
  movies.forEach((movie) => {
    const type = movie.Type.charAt(0).toUpperCase() + movie.Type.slice(1);
    if (typeCounts[type]) {
      typeCounts[type]++;
    } else {
      typeCounts[type] = 1;
    }
  });

  return Object.entries(typeCounts).map(
    ([type, count]) => `${type} (${count})`
  );
};
