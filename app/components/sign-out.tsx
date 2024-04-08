import { memo } from 'react';
import { Typography, Button } from '@mui/material';
import { signOut } from '@/auth';

async function SignOut({ children }: { children: React.ReactNode }) {
    return (
        <form
            action={async () => {
                'use server';
                await signOut();
            }}
        >
            <Typography>{children}</Typography>
            <Button variant="outlined" type="submit">Sign out</Button>
        </form>
    );
}

export default memo(SignOut);
