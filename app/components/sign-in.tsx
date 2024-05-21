import { memo } from 'react';
import { Typography, Button } from '@mui/material';
import { signInToGoogle } from '@/app/lib/actions';
import GoogleIcon from '@/app/components/icons/google-icon';

function SignIn() {
    return (
        <form action={signInToGoogle}>
            <Typography>You are not logged in</Typography>
            <Button variant="outlined" type="submit" startIcon={<GoogleIcon />}>
                Sign in with Google
            </Button>
        </form>
    );
}

export default memo(SignIn);
