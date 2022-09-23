import { Box, Stack, Typography, useTheme } from "@mui/material";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import { MyUser } from "../../types/types";
import DashboardHeader from "./DashboardHeader";
import SavedAlbums from "./SavedAlbums";
import TopArtists from "./TopArtists";
// import { TextPlugin } from "gsap/TextPlugin";

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
  const [type, setType] = useState<"artists" | "albums">("artists");
  const [range, setRange] = useState<"long" | "medium" | "short">("long");

  const mainTypeRef = useRef<HTMLSpanElement>(null);
  const subTypeRef = useRef<HTMLSpanElement>(null);
  //   gsap.registerPlugin(TextPlugin);

  //   useEffect(() => {
  //     console.log("type changed", type);
  //     if (type === "artists") {
  //       gsap.to(mainTypeRef.current, {
  //         duration: 1,
  //         text: "Top Artists",
  //       });
  //       gsap.to(subTypeRef.current, {
  //         duration: 1,
  //         text: "Saved Albums",
  //       });
  //     } else {
  //       gsap.to(mainTypeRef.current, {
  //         duration: 1,
  //         text: "Saved Albums",
  //       });
  //       gsap.to(subTypeRef.current, {
  //         duration: 1,
  //         text: "Top Artists",
  //       });
  //     }
  //   }, [type]);

  return (
    <Stack bgcolor={theme.spotify.black} p={3} minHeight="100vh">
      <DashboardHeader user={user} />
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="row" gap={1}>
          <Typography
            fontSize={36}
            fontWeight="bold"
            color="white"
            ref={mainTypeRef}
          >
            {/* {type === "artists" ? "Top Artists" : "Saved Albums"} */}
            Top Artists
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
              {/* {type === "artists" ? "Saved Albums" : "Top Artists"} */}
              Saved Albums
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
        <SavedAlbums savedAlbums={savedAlbums.items} />
      ) : (
        <TopArtists
          topArtistsLongTerm={topArtistsLongTerm.items}
          topArtistsMediumTerm={topArtistsMediumTerm.items}
          topArtistsShortTerm={topArtistsShortTerm.items}
          range={range}
        />
      )}
    </Stack>
  );
};

export default Dashboard;
