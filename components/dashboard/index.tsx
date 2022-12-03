import { Box, Stack, Typography, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { MySession, MyUser } from "../../types/types";
import DashboardHeader from "./DashboardHeader";
import SavedAlbums from "./SavedAlbums";
import TopArtists from "./TopArtists";
import ScoreCard from "./ScoreCard";
import { RootState, useAppDispatch, useAppSelector } from "../../redux/store";
import { getSpotifyUserData } from "../../redux/slices/spotify";
import { createSelector } from "@reduxjs/toolkit";

type Props = {
  session: MySession;
};

const Dashboard = ({ session }: Props) => {
  const theme = useTheme();
  const [type, setType] = useState<"artists" | "albums">("artists");
  const [range, setRange] = useState<"long" | "medium" | "short">("long");

  const mainTypeRef = useRef<HTMLSpanElement>(null);
  const subTypeRef = useRef<HTMLSpanElement>(null);
  const dispatch = useAppDispatch();

  const spotifyUserSelector = createSelector(
    (state: RootState) => state.spotify,
    (spotify) => spotify.user
  );

  const spotifyUser = useAppSelector(spotifyUserSelector);

  // const spotifyUser = useAppSelector((state: RootState) => state.spotify.user);

  useEffect(() => {
    if (!spotifyUser) {
      dispatch(getSpotifyUserData(session)).catch((err) => {
        console.log(err);
        // Redirect to login page
      });
    }
  }, [dispatch, session, spotifyUser]);

  const user = session.user as MyUser;

  return (
    <Stack bgcolor={theme.spotify.black} p={3} minHeight="100vh">
      <DashboardHeader user={user} />
      <Stack direction="row" gap={2}>
        <ScoreCard
          size={200}
          imageUrl={spotifyUser?.images ? spotifyUser.images[0].url : ""}
          loading={false}
          score={30}
          title={session.user?.name ?? ""}
          disableHover
        />
        {/* <Image
          alt="User Profile Picture"
          width={200}
          style={{ borderRadius: 12 }}
          height={200}
          src={(user && user.image) ?? ""}
        /> */}
        <Stack>
          <Typography
            fontSize={38}
            fontWeight="bold"
            color={theme.spotify.green}
          >
            {(user && user.name) ?? "Anonymous"}
          </Typography>
        </Stack>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row" gap={1}>
          <Typography
            fontSize={36}
            fontWeight="bold"
            color="white"
            ref={mainTypeRef}
          >
            {type === "artists" ? "Top Artists" : "Saved Albums"}
          </Typography>
          <Box
            sx={{
              cursor: "pointer",
            }}
          >
            <Typography
              ref={subTypeRef}
              fontSize={36}
              fontWeight="bold"
              color="white"
              onClick={() =>
                setType((prev) => (prev === "artists" ? "albums" : "artists"))
              }
              sx={{
                opacity: 0.3,
                transition: "opacity 0.3s",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              {type === "artists" ? "Saved Albums" : "Top Artists"}
            </Typography>
          </Box>
        </Stack>
        {type === "artists" && (
          <Stack
            direction="row"
            gap={1}
            divider={
              <Typography
                fontSize={36}
                fontWeight="bold"
                color="white"
                sx={{
                  opacity: 0.3,
                  transition: "opacity 0.3s",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              >
                |
              </Typography>
            }
          >
            <Typography
              onClick={() => setRange("long")}
              fontSize={36}
              fontWeight="bold"
              color="white"
              sx={{
                cursor: "pointer",
                opacity: range === "long" ? 1 : 0.3,
                transition: "opacity 0.3s",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              All Time
            </Typography>
            <Typography
              onClick={() => setRange("medium")}
              fontSize={36}
              fontWeight="bold"
              color="white"
              sx={{
                cursor: "pointer",
                opacity: range === "medium" ? 1 : 0.3,
                transition: "opacity 0.3s",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              Last 6 Months
            </Typography>
            <Typography
              onClick={() => setRange("short")}
              fontSize={36}
              fontWeight="bold"
              color="white"
              sx={{
                cursor: "pointer",
                opacity: range === "short" ? 1 : 0.3,
                transition: "opacity 0.3s",
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              Last 4 Weeks
            </Typography>
          </Stack>
        )}
      </Stack>
      {type === "albums" ? (
        <SavedAlbums session={session} />
      ) : (
        <TopArtists session={session} range={range} />
      )}
    </Stack>
  );
};

export default Dashboard;
