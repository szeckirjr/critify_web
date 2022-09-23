import { Stack, Box, Typography, Button, useTheme } from "@mui/material";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { MyUser } from "../../types/types";

const DashboardHeader = ({ user }: { user: MyUser }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Box
        onClick={() => window.location.reload()}
        sx={{
          cursor: "pointer",
        }}
      >
        <Typography fontSize={50} fontWeight="bold" color={theme.spotify.green}>
          Dashboard
        </Typography>
      </Box>
      <Stack gap={1} alignItems="center">
        <Box
          bgcolor={"green"}
          overflow="hidden"
          width={50}
          height={50}
          borderRadius={10}
        >
          <Image
            alt="User Profile Picture"
            width={50}
            height={50}
            src={user.image ?? ""}
          />
        </Box>
        <Button
          variant="contained"
          onClick={() => signOut()}
          sx={{
            paddingX: 2,
            paddingY: 1,
            backgroundColor: "transparent",
            color: theme.spotify.green,
            "&:hover": {
              backgroundColor: theme.spotify.green,
              color: "white",
            },
            boxShadow: "none",
          }}
          color="inherit"
        >
          Sign Out
        </Button>
      </Stack>
    </Stack>
  );
};

export default DashboardHeader;
