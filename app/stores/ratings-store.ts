import { createStore } from 'zustand';
import { nanoid } from 'nanoid';

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
    addRating: (userId: string, movieID: string, rating: number) => void;
    editRating: (id: string, rating: number) => void;
    deleteRating: (id: string) => void;
};

export type RatingsStore = RatingsState & RatingsActions;

export const defaultInitState: RatingsState = {
    ratings: [],
};

export const createRatingsStore = (
    initState: RatingsState = defaultInitState,
) => {
    return createStore<RatingsStore>()((set) => ({
        ...initState,
        addRating: (userID: string, movieID: string, rating: number) => {
            set((state) => ({ ratings: [...state.ratings, { id: nanoid(), userID, movieID, rating }] }))
        },
        editRating: (id: string, rating: number) => set((state) => ({ ratings: state.ratings.map((r) => (r.id === id ? { ...r, rating } : r)) })),
        deleteRating: (id: string) => set((state) => ({ ratings: state.ratings.filter((r) => r.id !== id) })),
    }));
};
