import { memo } from 'react';
import { Typography, Button } from '@mui/material';
import { signIn } from '@/auth';

function SignIn() {
    return (
        <form
            action={async () => {
                'use server';
                await signIn('google');
            }}
        >
            <Typography>You are not logged in</Typography>
            <Button variant="outlined" type="submit">Sign in with Google</Button>
        </form>
    );
}

export default memo(SignIn);
