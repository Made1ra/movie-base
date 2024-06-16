"use client";

import { useState, memo, SyntheticEvent } from "react";
import { nanoid } from "nanoid";
import { Modal, Box, Typography, Rating, Button } from "@mui/material";
import { postRating, patchRatings, deleteRating } from "@/app/lib/actions";
import { useUserStore } from "@/app/stores/user-store";
import { useRatingsStore } from "@/app/stores/ratings-store";
import StarIcon from "@/app/components/icons/star-icon";

function ModalRating({
  open,
  onClose,
  title,
  movieID,
  rating,
  setRating,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  movieID: string;
  rating: number | null;
  setRating: (rating: number | null) => void;
}) {
  const [value, setValue] = useState<number | null>(null);

  const { user } = useUserStore((state) => state);
  const { ratings, addRating, removeRating } = useRatingsStore(
    (state) => state
  );

  const isRated = ratings.find((rating) => rating.movieID === movieID);

  function handleChange(
    _: SyntheticEvent<Element, Event>,
    newValue: number | null
  ) {
    setValue(newValue);
  }

  function rateMovie() {
    if (value) {
      addRating(nanoid(), user?.id || "", movieID, value);
      postRating(nanoid(), user?.id || "", movieID, value);
      patchRatings(movieID, user?.id || "", value);
      setRating(value);
      onClose();
    }
  }

  function unrateMovie() {
    const id = ratings.find((rating) => rating.movieID === movieID)?.id;
    if (id) {
      removeRating(id);
      deleteRating(id, user?.id || "");
      setValue(null);
      setRating(value);
      onClose();
    }
  }

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-title">
      <Box
        className="flex flex-col items-center mt-80 bg-zinc-50 p-4 w-96 rounded shadow absolute left-[36rem]
            max-sm:mt-80 max-sm:left-4 max-sm:w-72"
      >
        <StarIcon className="w-12 h-12 -mt-11" />
        <div className="absolute text-zinc-50 text-lg -top-4">
          {value ? value : "?"}
        </div>
        <button
          onClick={onClose}
          className="font-bold text-xl absolute -top-8 left-[22.5rem] rounded-full p-1
                    hover:bg-zinc-50"
        >
          X
        </button>
        <Typography className="uppercase text-amber-400">RATE THIS</Typography>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          className="text-zinc-950"
        >
          {title}
        </Typography>
        <Rating
          value={value}
          onChange={handleChange}
          max={10}
          className="border-white outline-white mb-2"
        />
        <Button
          onClick={rateMovie}
          variant="contained"
          disabled={!value || value === rating}
        >
          Rate
        </Button>
        {isRated && (
          <Button
            onClick={unrateMovie}
            variant="contained"
            style={{ marginTop: "0.5rem" }}
          >
            Remove rating
          </Button>
        )}
      </Box>
    </Modal>
  );
}

export default memo(ModalRating);
