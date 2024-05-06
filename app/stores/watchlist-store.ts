import { createStore } from 'zustand';
import { nanoid } from 'nanoid';

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

export const defaultInitState: WatchlistState = {
    watchlist: [],
};

export const createWatchlistStore = (
    initState: WatchlistState = defaultInitState,
) => {
    return createStore<WatchlistStore>()((set) => ({
        ...initState,
        addToWatchlist: (userID: string, movieID: string) => set((state) => ({ watchlist: [...state.watchlist, { id: nanoid(), userID, movieID }] })),
        removeFromWatchlist: (id: string) => set((state) => ({ watchlist: state.watchlist.filter((w) => w.id !== id) })),
    }));
};
