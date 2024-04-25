import { Metadata } from 'next';
import { useParams } from 'next/navigation';
import BackButton from '@/app/components/back-button';
import AccountMenu from '@/app/components/account-menu';

export const metadata: Metadata = {
    title: 'Your Watchlist - Movie Base',
};

export default async function Watchlist() {
    const { id } = useParams();

    return (
        <div>
            <div className="absolute top-8 left-8">
                <BackButton />
            </div>
            <AccountMenu image={''} name={''} id={''} />
        </div>
    );
}
