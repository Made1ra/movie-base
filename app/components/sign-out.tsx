import { memo } from "react";
import { Typography, Button } from "@mui/material";
import Logout from "@mui/icons-material/Logout";
import { signOutFromGoogle } from "@/app/lib/actions";

function SignOut({ children }: { children?: React.ReactNode }) {
  return (
    <form
      action={signOutFromGoogle}
      className="flex flex-row justify-center items-center"
    >
      <Typography>{children}</Typography>
      <Button
        variant="outlined"
        type="submit"
        startIcon={<Logout fontSize="small" />}
      >
        Sign out
      </Button>
    </form>
  );
}

export default memo(SignOut);
