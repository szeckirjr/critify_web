import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import ArtistAlbums from "../../components/ArtistAlbums";
import ScoreCard from "../../components/dashboard/ScoreCard";
import { getCleanName } from "../../lib/scraper";
import { useAppSelector } from "../../redux/store";

const ArtistPage: NextPage = () => {
  const router = useRouter();
  const { name } = router.query;

  const theme = useTheme();

  const metaInfo = useAppSelector(
    (state) => state.metacritic.artists[getCleanName(name as string)]
  );

  const spotifyInfo = useAppSelector(
    (state) => state.spotify.artists[getCleanName(name as string)]
  );

  return (
    <Box>
      <Stack
        bgcolor={theme.spotify.black}
        p={3}
        gap={3}
        minHeight="100vh"
        alignItems="flex-start"
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: theme.spotify.green,
            paddingX: 3,
            paddingY: 1,
            "&:hover": {
              backgroundColor: theme.spotify.darkGreen,
            },
          }}
          fullWidth={false}
          onClick={() => router.push("/")}
        >
          Back
        </Button>
        <Box>
          <Stack direction="row" justifyContent="space-between" gap={3}>
            <ScoreCard
              size={280}
              imageUrl={spotifyInfo?.images ? spotifyInfo.images[0].url : ""}
              loading={false}
              score={metaInfo?.avgCareerScore ?? 0}
              disableHover
              disableGradient
              scoreFontSize={40}
            />
            <Typography
              fontSize={50}
              fontWeight="bold"
              color={theme.spotify.green}
            >
              {metaInfo?.name ?? name}
            </Typography>
          </Stack>
        </Box>
        <ArtistAlbums name={spotifyInfo?.name ?? metaInfo?.name} />
      </Stack>
    </Box>
  );
};

export default ArtistPage;
