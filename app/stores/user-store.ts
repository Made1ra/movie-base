import { create } from 'zustand';
import { User } from '@/app/lib/definitions';
import { emailToId } from '@/app/lib/utils';

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
            user: { id: emailToId(email), name, email, image },
        })),
}));
