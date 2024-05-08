'use client';

import { Typography } from '@mui/material';
import { useUserStore } from '@/app/stores/user-store';
import { authorizeUser } from '@/app/lib/actions';
import SignIn from '@/app/components/sign-in';
import BackButton from '@/app/components/back-button';
import AccountMenu from '@/app/components/account-menu';
import Search from '@/app/components/search';
import Movies from '@/app/components/movies';
import { useState, useEffect } from 'react';
import { Session } from 'next-auth';

export default function Home({
  searchParams
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';

  const [session, setSession] = useState<Session | null | undefined>(null);

  const { user, addUser } = useUserStore((state) => state);

  useEffect(() => {
    async function getSession() {
      const session = await authorizeUser();
      setSession(session);
      if (session?.user) {
        addUser(session.user.id || '', session.user.name || '', session.user.email || '', session.user.image || '');
      }
    }

    getSession();
  }, [addUser]);

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
          <AccountMenu image={user?.image} name={user?.name} id={user?.id} />
          <Search placeholder="Search movies..." />
          <Movies query={query} />
        </>
      ) : (
        <SignIn />
      )}
    </div>
  );
}
