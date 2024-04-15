'use client';

import { useState, memo, SyntheticEvent } from 'react';
import { Modal, Box, Typography, Rating, Button } from '@mui/material';
import StarIcon from '@/app/components/star-icon';

function ModalRating({ open, onClose, title }: { open: boolean, onClose: () => void, title: string }) {
    const [value, setValue] = useState<number | null>(null);

    function handleChange(_: SyntheticEvent<Element, Event>, newValue: number | null) {
        setValue(newValue);
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
        >
            <Box className="flex flex-col items-center mt-80 bg-zinc-50 p-4 w-96 rounded shadow absolute left-[47.5rem]">
                <StarIcon className="w-12 h-12 -mt-11" />
                <div className="absolute text-zinc-50 text-lg -top-4">{value ? value : '?'}</div>
                <button
                    onClick={onClose}
                    className="font-bold text-xl absolute -top-8 left-[22.5rem] rounded-full p-1
                    hover:bg-zinc-50"
                >
                    X
                </button>
                <Typography className="uppercase text-amber-400">RATE THIS</Typography>
                <Typography id="modal-modal-title" variant="h6" component="h2" className="text-zinc-950">
                    {title}
                </Typography>
                <Rating value={value} onChange={handleChange} max={10} className="border-white outline-white mb-2" />
                <Button
                    onClick={undefined}
                    variant="contained"
                    disabled={!value}
                >
                    Rate
                </Button>
                {/* {value && (
                    <Button onClick={undefined} variant="contained" style={{ marginTop: '0.5rem' }}>Remove rating</Button>
                )} */}
            </Box>
        </Modal >
    );
}

export default memo(ModalRating);
