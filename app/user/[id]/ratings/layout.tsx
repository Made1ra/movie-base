import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Your Ratings - Movie Base',
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
        </>
    );
}
