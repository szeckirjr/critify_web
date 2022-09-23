import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { MyUser } from "../../types/types";
import AlbumCard from "./AlbumCard";
import ArtistCard from "./ArtistCard";

type Props = {
  user: MyUser;
  topArtistsLongTerm: SpotifyApi.UsersTopArtistsResponse;
  topArtistsMediumTerm: SpotifyApi.UsersTopArtistsResponse;
  topArtistsShortTerm: SpotifyApi.UsersTopArtistsResponse;
  savedAlbums: SpotifyApi.UsersSavedAlbumsResponse;
};

const Dashboard = ({
  user,
  topArtistsLongTerm,
  topArtistsMediumTerm,
  topArtistsShortTerm,
  savedAlbums,
}: Props) => {
  const theme = useTheme();
  return (
    <Stack bgcolor={theme.spotify.black} p={3} minHeight="100vh">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box
          onClick={() => window.location.reload()}
          sx={{
            cursor: "pointer",
          }}
        >
          <Typography
            fontSize={50}
            fontWeight="bold"
            color={theme.spotify.green}
          >
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
      <Stack gap={4}>
        <Box>
          <Typography fontSize={36} fontWeight="bold" color="white">
            Your Saved Albums
          </Typography>
          <Stack direction="row" gap={3} overflow="scroll" p={2}>
            {savedAlbums?.items?.map(
              (release: SpotifyApi.SavedAlbumObject, idx: number) => (
                <AlbumCard
                  key={release.album.id}
                  album={release.album}
                  index={idx}
                />
              )
            )}
          </Stack>
        </Box>
        <Box>
          <Typography fontSize={36} fontWeight="bold" color="white">
            Top Artists
          </Typography>
          <Box
            display="flex"
            gap={4}
            flexWrap="wrap"
            justifyContent="flex-start"
            p={1}
          >
            {topArtistsLongTerm?.items?.map(
              (release: SpotifyApi.ArtistObjectFull, idx: number) => (
                <ArtistCard key={release.id} artist={release} index={idx} />
              )
            )}
          </Box>
        </Box>
      </Stack>
    </Stack>
  );
};

export default Dashboard;
