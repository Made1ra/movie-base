import { create } from 'zustand';
import { User } from '@/app/lib/definitions';

export type UserState = {
    user: User | null;
};

export type UserActions = {
    addUser: (id: string, name: string, email: string, image: string) => void;
};

export type UserStore = UserState & UserActions;

export const useUserStore = create<UserStore>()((set) => ({
    user: null,
    addUser: (id: string, name: string, email: string, image: string) =>
        set((state) => ({
            ...state,
            user: { id, name, email, image },
        })),
}));
