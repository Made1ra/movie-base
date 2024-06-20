import { memo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, Typography } from "@mui/material";

function SearchCard({
  imdbID,
  Poster,
  Title,
  Year,
}: {
  imdbID: string;
  Poster: string;
  Title: string;
  Year: string;
}) {
  return (
    <Link href={`/title/${imdbID}`}>
      <Card
        className="flex flex-col justify-center items-center mb-4 w-96 p-2 rounded-lg shadow-xl border
                            hover:border-blue-400
                            active:border-blue-400 active:border-dashed
                            dark:shadow-none
                             max-sm:w-72"
      >
        {Poster === "N/A" ? (
          <Typography>No poster available</Typography>
        ) : (
          <div className="relative w-full">
            <Image
              src={Poster}
              alt={Title || ""}
              width={500}
              height={750}
              sizes="100%"
              priority
              className="rounded-sm shadow"
            />
          </div>
        )}
        <Typography variant="h3" className="text-center">
          {Title}
        </Typography>
        <Typography variant="h6" className="text-center">
          {Year}
        </Typography>
      </Card>
    </Link>
  );
}

export default memo(SearchCard);
