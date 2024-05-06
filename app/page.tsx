'use client';

import { useState, useEffect } from 'react';
import { Session } from 'next-auth';
import { Typography } from '@mui/material';
import { auth } from '@/auth';
import { useUserStore } from '@/app/providers/user-store-provider';
import SignIn from '@/app/components/sign-in';
import BackButton from '@/app/components/back-button';
import AccountMenu from '@/app/components/account-menu';
import Search from '@/app/components/search';
import Movies from '@/app/components/movies';
import { User } from '@/app/lib/definitions';

export default function Home({
  searchParams
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';

  const [session, setSession] = useState<Session | null>(null);

  const { user, addUser }: {
    user: User; addUser: (name: string, email: string, image: string) => void
  } = useUserStore((state) => state) as { user: User; addUser: (name: string, email: string, image: string) => void };

  if (session?.user) {
    addUser(session?.user?.name || '', session?.user?.email || '', session?.user?.image || '');
  }

  useEffect(() => {
    async function authorizeUser() {
      try {
        const session = await auth();
        setSession(session);
      } catch (error) {
        console.error(error);
      }
    }

    authorizeUser();
  }, []);

  return (
    <div className="flex flex-col items-center text-center min-h-screen">
      <div className="mt-8">
        <Typography variant="h3">Movie Base</Typography>
      </div>
      {session?.user ? (
        <>
          <div className="absolute top-8 left-8">
            <BackButton />
          </div>
          <AccountMenu image={session?.user?.image || ''} name={session?.user?.name || ''} id={user.id} />
          <Search placeholder="Search movies..." />
          <Movies query={query} />
        </>
      ) : (
        <SignIn />
      )}
    </div>
  );
}
