import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import AlbumCard from "./AlbumCard";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { getSavedAlbums } from "../../redux/slices/spotify";
import { MySession } from "../../types/types";

const SavedAlbums = ({ session }: { session: MySession }): JSX.Element => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const [showAll, setShowAll] = useState<boolean>(true);
  const [parent] = useAutoAnimate({
    duration: 500,
    easing: "ease-in-out",
  });

  const savedAlbums = useAppSelector((state) => state.spotify.savedAlbums);

  useEffect(() => {
    if (!savedAlbums || savedAlbums.length === 0) {
      dispatch(getSavedAlbums(session));
    }
  });

  const albumCards = useMemo(
    () =>
      savedAlbums.map(({ album }) => (
        <AlbumCard
          showAll={showAll}
          key={album.id}
          albumName={album.name}
          artistName={album.artists[0].name}
        />
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
