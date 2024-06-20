"use client";

import { memo, useState, MouseEvent } from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import { ListItemIcon } from "@mui/material";
import MovieIcon from "@/app/components/icons/movie-icon";
import SignOut from "@/app/components/sign-out";

function AccountMenu({
  image,
  name,
  id,
}: {
  image?: string;
  name?: string;
  id?: string;
}) {
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorElement);

  function handleClick(event: MouseEvent<HTMLElement>) {
    setAnchorElement(event.currentTarget);
  }

  function handleClose() {
    setAnchorElement(null);
  }

  return (
    <div className="absolute top-8 right-8 max-sm:top-4">
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar sx={{ width: 32, height: 32 }} src={image} alt={name} />
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorElement}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem>
          <Link
            href={`/user/${id}/watchlist`}
            className="flex justify-center items-center"
          >
            <ListItemIcon>
              <MovieIcon />
            </ListItemIcon>
            Your watchlist
          </Link>
        </MenuItem>
        <MenuItem>
          <Link
            href={`/user/${id}/ratings`}
            className="flex justify-center items-center"
          >
            <ListItemIcon>
              <MovieIcon />
            </ListItemIcon>
            Your ratings
          </Link>
        </MenuItem>
        <MenuItem>
          <SignOut />
        </MenuItem>
      </Menu>
    </div>
  );
}

export default memo(AccountMenu);
