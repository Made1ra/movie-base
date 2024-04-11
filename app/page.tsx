import { Typography } from '@mui/material';
import { auth } from '@/auth';
import SignIn from '@/app/components/sign-in';
import SignOut from '@/app/components/sign-out';
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
  const user = session?.user?.name;
  const query = searchParams?.query || '';

  return (
    <div className="flex flex-col items-center mt-8 text-center min-h-screen">
      <Typography variant="h3">Home</Typography>
      {user ? (
        <>
          <SignOut>{`Welcome, ${user}!`}</SignOut>
          <Search placeholder="Search movies..." />
          <Movies query={query} />
        </>
      ) : (
        <SignIn />
      )}
    </div>
  );
}
