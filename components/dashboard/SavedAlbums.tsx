import { Box } from "@mui/material";
import AlbumCard from "./AlbumCard";

const SavedAlbums = ({
  savedAlbums,
}: {
  savedAlbums: SpotifyApi.SavedAlbumObject[];
}): JSX.Element => {
  return (
    <Box>
      {/* <Stack direction="row" gap={3} overflow="scroll" p={2}> */}
      <Box display="flex" gap={4} flexWrap="wrap">
        {savedAlbums?.map(({ album }: SpotifyApi.SavedAlbumObject) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </Box>
      {/* </Stack> */}
    </Box>
  );
};

export default SavedAlbums;
