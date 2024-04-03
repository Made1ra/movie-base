import { Typography } from '@mui/material';
import { auth } from '@/auth';
import SignIn from './components/sign-in';
import SignOut from './components/sign-out';

export default async function Home() {
  const session = await auth();
  const user = session?.user?.email;

  return (
    <div className="flex flex-col items-center mt-64">
      <Typography variant="h3">Home</Typography>
      <div className="text-center">
        {user ? <SignOut>{`Welcome ${user}`}</SignOut> : <SignIn />}
      </div>
    </div>
  );
}
