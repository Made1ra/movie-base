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
            className="flex flex-row justify-end items-center gap-2 self-end -mt-8 mr-4"
        >
            <Typography>{children}</Typography>
            <Button variant="outlined" type="submit">Sign out</Button>
        </form>
    );
}

export default memo(SignOut);
