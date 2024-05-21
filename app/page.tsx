'use client';

import { useState, useEffect, useCallback } from 'react';
import { Session } from 'next-auth';
import { Typography } from '@mui/material';
import { useUserStore } from '@/app/stores/user-store';
import { authorizeUser } from '@/app/lib/actions';
import SignIn from '@/app/components/sign-in';
import BackButton from '@/app/components/back-button';
import AccountMenu from '@/app/components/account-menu';
import Search from '@/app/components/search';
import { Badge } from '@/app/components/badge';
import ChevronUpIcon from '@/app/components/icons/chevron-up-icon';
import Movies from '@/app/components/movies';

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
  const [showBackToTop, setShowBackToTop] = useState(false);

  const { user, addUser } = useUserStore((state) => state);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

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

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 100) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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
          <AccountMenu image={user?.image} name={user?.name} id={user?.id} />
          <Search placeholder="Search movies..." />
          {showBackToTop && (
            <Badge
              onClick={scrollToTop}
              className="z-10 fixed top-4 left-[55rem] px-2 py-1 bg-neutral-50 text-black rounded-xl cursor-pointer shadow-xl text-base
                    hover:bg-neutral-300 hover:text-black"
            >
              <ChevronUpIcon className="w-6 h-6 mr-2" />
              Back to top
            </Badge>
          )}
          <Movies query={query} />
        </>
      ) : (
        <SignIn />
      )}
    </div>
  );
}
