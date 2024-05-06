'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { type StoreApi, useStore } from 'zustand';

import {
    type RatingsStore,
    createRatingsStore
} from '@/app/stores/ratings-store';

export const RatingsStoreContext = createContext<StoreApi<RatingsStore> | null>(
    null,
);

export interface RatingsStoreProviderProps {
    children: ReactNode;
}

export const RatingsStoreProvider = ({
    children,
}: RatingsStoreProviderProps) => {
    const storeRef = useRef<StoreApi<RatingsStore>>();
    if (!storeRef.current) {
        storeRef.current = createRatingsStore();
    }

    return (
        <RatingsStoreContext.Provider value={storeRef.current}>
            {children}
        </RatingsStoreContext.Provider>
    )
}

export const useCounterStore = <T,>(
    selector: (store: RatingsStore) => T,
): T => {
    const ratingsStoreContext = useContext(RatingsStoreContext)

    if (!ratingsStoreContext) {
        throw new Error(`useRatingsStore must be use within RatingsStoreProvider`)
    }

    return useStore(ratingsStoreContext, selector)
}
