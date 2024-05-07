'use client';

import { Metadata } from 'next';
import { useUserStore } from '@/app/stores/user-store';
import BackButton from '@/app/components/back-button';
import AccountMenu from '@/app/components/account-menu';

export const metadata: Metadata = {
    title: 'Your Ratings - Movie Base',
};

export default function Ratings() {
    const { user } = useUserStore((state) => state);

    return (
        <div>
            <div className="absolute top-8 left-8">
                <BackButton />
            </div>
            <AccountMenu image={user?.image} name={user?.name} id={user?.id} />
        </div>
    );
}
