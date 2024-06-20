import { create } from "zustand";

type Rating = {
  id: string;
  userID: string;
  movieID: string;
  rating: number;
};

export type RatingsState = {
  ratings: Rating[];
};

export type RatingsActions = {
  addRating: (
    id: string,
    userID: string,
    movieID: string,
    rating: number
  ) => void;
  editRating: (id: string, rating: number) => void;
  removeRating: (id: string) => void;
};

export type RatingsStore = RatingsState & RatingsActions;

export const useRatingsStore = create<RatingsStore>()((set) => ({
  ratings: [],
  addRating: (id: string, userID: string, movieID: string, rating: number) => {
    set((state) => ({
      ratings: [...state.ratings, { id: id, userID, movieID, rating }],
    }));
  },
  editRating: (id: string, rating: number) =>
    set((state) => ({
      ratings: state.ratings.map((r) => (r.id === id ? { ...r, rating } : r)),
    })),
  removeRating: (id: string) =>
    set((state) => ({ ratings: state.ratings.filter((r) => r.id !== id) })),
}));
