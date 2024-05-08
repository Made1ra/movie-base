import { create } from 'zustand';

type Watchlist = {
    id: string;
    userID: string;
    movieID: string;
};

export type WatchlistState = {
    watchlist: Watchlist[];
};

export type WatchlistActions = {
    addToWatchlist: (id: string, userID: string, movieID: string) => void;
    removeFromWatchlist: (id: string) => void;
};

export type WatchlistStore = WatchlistState & WatchlistActions;

export const useWatchlistStore = create<WatchlistStore>()((set) => ({
    watchlist: [],
    addToWatchlist: (id: string, userID: string, movieID: string) => set((state) => ({ watchlist: [...state.watchlist, { id, userID, movieID }] })),
    removeFromWatchlist: (id: string) => set((state) => ({ watchlist: state.watchlist.filter((w) => w.id !== id) })),
}));
