import { createStore } from 'zustand';
import { nanoid } from 'nanoid';
import { User } from '@/app/lib/definitions';

export type UserState = {
    user: User | null;
};

export type UserActions = {
    addUser: (name: string, email: string, image: string) => void;
};

export type UserStore = UserState & UserActions;

export const defaultInitState: UserState = {
    user: null,
};

export const createUserStore = (
    initState: UserState = defaultInitState,
) => {
    return createStore<UserStore>()((set) => ({
        ...initState,
        addUser: (name: string, email: string, image: string) => set((state) => ({ ...state, user: { id: nanoid(), name, email, image } })),
    }));
};
