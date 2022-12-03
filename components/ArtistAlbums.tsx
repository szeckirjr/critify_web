import { Typography, useTheme, Box } from "@mui/material";
import { getCleanName } from "../lib/scraper";
import { useAppSelector } from "../redux/store";
import AlbumCard from "./dashboard/AlbumCard";

type Props = {
  name: string;
};

const ArtistAlbums = ({ name }: Props) => {
  const theme = useTheme();

  const albumNames = useAppSelector(
    (state) => state.metacritic.artists[getCleanName(name)]?.albumNames
  );

  const albumCards = albumNames?.map((albumName, idx) => (
    <AlbumCard
      key={idx}
      albumName={albumName}
      artistName={name}
      showAll={true}
    />
  ));
  return (
    <Box>
      <Typography fontSize={50} fontWeight="bold" color={theme.spotify.green}>
        Albums
      </Typography>
      <Box display="flex" gap={4} flexWrap="wrap">
        {albumCards}
      </Box>
    </Box>
  );
};

export default ArtistAlbums;
