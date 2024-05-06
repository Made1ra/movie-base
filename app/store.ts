import { create } from 'zustand';
import { nanoid } from 'nanoid';

type Rating = {
    id: string;
    userID: string;
    movieID: string;
    rating: number;
};

type RatingsState = {
    ratings: Rating[];
    addRating: (userId: string, movieID: string, rating: number) => void;
    editRating: (id: string, rating: number) => void;
    deleteRating: (id: string) => void;
};

type Watchlist = {
    id: string;
    userID: string;
    movieID: string;
};

type WatchlistState = {
    watchlist: Watchlist[];
    addToWatchlist: (id: string, userID: string, movieID: string) => void;
    removeFromWatchlist: (id: string) => void;
}

export const useUserStore = create((set) => ({
    user: {},
    addUser: (name: string, email: string, image: string) => set(() => ({ id: nanoid(), name, email, image })),
}));

export const useRatingsStore = create<RatingsState>((set) => ({
    ratings: [],
    addRating: (userID: string, movieID: string, rating: number) => {
        set((state) => ({ ratings: [...state.ratings, { id: nanoid(), userID, movieID, rating }] }))
    },
    editRating: (id: string, rating: number) => set((state) => ({ ratings: state.ratings.map((r) => (r.id === id ? { ...r, rating } : r)) })),
    deleteRating: (id: string) => set((state) => ({ ratings: state.ratings.filter((r) => r.id !== id) })),
}));

export const useWatchlistStore = create<WatchlistState>((set) => ({
    watchlist: [],
    addToWatchlist: (userID: string, movieID: string) => set((state) => ({ watchlist: [...state.watchlist, { id: nanoid(), userID, movieID }] })),
    removeFromWatchlist: (id: string) => set((state) => ({ watchlist: state.watchlist.filter((w) => w.id !== id) })),
}));
