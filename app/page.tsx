import { Typography } from '@mui/material';
import { auth } from '@/auth';
import SignIn from '@/app/components/sign-in';
import BackButton from '@/app/components/back-button';
import AccountMenu from '@/app/components/account-menu';
import Search from '@/app/components/search';
import Movies from '@/app/components/movies';

export default async function Home({
  searchParams
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const session = await auth();
  const user = session?.user;
  const query = searchParams?.query || '';

  return (
    <div className="flex flex-col items-center text-center min-h-screen">
      <div className="mt-8">
        <Typography variant="h3">Movie Base</Typography>
      </div>
      {user ? (
        <>
          <div className="absolute top-8 left-8">
            <BackButton />
          </div>
          <AccountMenu image={user?.image || ''} name={user?.name || ''} id={''} />
          <Search placeholder="Search movies..." />
          <Movies query={query} />
        </>
      ) : (
        <SignIn />
      )}
    </div>
  );
}
