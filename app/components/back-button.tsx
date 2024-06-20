"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import ArrowLeftIcon from "@/app/components/icons/arrow-left-icon";

function BackButton() {
  const router = useRouter();

  return (
    <Button type="button" onClick={() => router.back()}>
      <ArrowLeftIcon />
    </Button>
  );
}

export default memo(BackButton);
