import { create } from 'zustand';
import { nanoid } from 'nanoid';
import { User } from '@/app/lib/definitions';

export type UserState = {
    user: User | null;
};

export type UserActions = {
    addUser: (name: string, email: string, image: string) => void;
};

export type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>()((set) => ({
    user: null,
    addUser: (name: string, email: string, image: string) =>
        set((state) => ({
            ...state,
            user: { id: nanoid(), name, email, image },
        })),
}));
