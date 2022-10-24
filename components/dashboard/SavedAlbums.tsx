import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  useTheme,
} from "@mui/material";
import { useMemo, useState } from "react";
import AlbumCard from "./AlbumCard";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const SavedAlbums = ({
  savedAlbums,
}: {
  savedAlbums: SpotifyApi.SavedAlbumObject[];
}): JSX.Element => {
  const theme = useTheme();
  const [showAll, setShowAll] = useState<boolean>(true);
  const [parent] = useAutoAnimate({
    duration: 500,
    easing: "ease-in-out",
  });

  const albumCards = useMemo(
    () =>
      savedAlbums.map(({ album }) => (
        <AlbumCard showAll={showAll} key={album.id} album={album} />
      )),
    [savedAlbums, showAll]
  );

  return (
    <Box>
      <FormControlLabel
        value={showAll}
        onChange={() => setShowAll(!showAll)}
        label={<Typography color="white">Score only</Typography>}
        control={
          <Checkbox
            size="medium"
            color="success"
            sx={{
              "&.Mui-checked": {
                backgroundColor: "transparent",
                color: theme.spotify.green,
              },
              color: "white",
            }}
          />
        }
      />
      {/* <Stack direction="row" gap={3} overflow="scroll" p={2}> */}
      <Box ref={parent} display="flex" gap={4} flexWrap="wrap">
        {albumCards}
      </Box>
      {/* </Stack> */}
    </Box>
  );
};

export default SavedAlbums;
