'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { type StoreApi, useStore } from 'zustand'

import {
    type WatchlistStore,
    createWatchlistStore
} from '@/app/stores/watchlist-store'

export const WatchlistStoreContext = createContext<StoreApi<WatchlistStore> | null>(
    null,
);

export interface WatchlistStoreProviderProps {
    children: ReactNode;
}

export const WatchlistStoreProvider = ({
    children,
}: WatchlistStoreProviderProps) => {
    const storeRef = useRef<StoreApi<WatchlistStore>>()
    if (!storeRef.current) {
        storeRef.current = createWatchlistStore();
    }

    return (
        <WatchlistStoreContext.Provider value={storeRef.current}>
            {children}
        </WatchlistStoreContext.Provider>
    )
}

export const useCounterStore = <T,>(
    selector: (store: WatchlistStore) => T,
): T => {
    const counterStoreContext = useContext(WatchlistStoreContext);

    if (!counterStoreContext) {
        throw new Error(`useWatchlistStore must be use within WatchlistStoreProvider`);
    }

    return useStore(counterStoreContext, selector);
}
