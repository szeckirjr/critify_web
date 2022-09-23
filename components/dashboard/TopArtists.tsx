import { Box } from "@mui/material";
import { Range } from "../../types/types";
import ArtistCard from "./ArtistCard";

type Props = {
  topArtistsLongTerm: SpotifyApi.ArtistObjectFull[];
  topArtistsMediumTerm: SpotifyApi.ArtistObjectFull[];
  topArtistsShortTerm: SpotifyApi.ArtistObjectFull[];
  range: Range;
};

const TopArtists = ({
  topArtistsLongTerm,
  topArtistsMediumTerm,
  topArtistsShortTerm,
  range,
}: Props) => {
  return (
    <Box>
      <Box
        display="flex"
        gap={4}
        flexWrap="wrap"
        justifyContent="flex-start"
        p={1}
      >
        {range === "long" &&
          topArtistsLongTerm?.map((artist, idx) => (
            <ArtistCard key={artist.id} artist={artist} index={idx} />
          ))}
        {range === "medium" &&
          topArtistsMediumTerm?.map((artist, idx) => (
            <ArtistCard key={artist.id} artist={artist} index={idx} />
          ))}
        {range === "short" &&
          topArtistsShortTerm?.map((artist, idx) => (
            <ArtistCard key={artist.id} artist={artist} index={idx} />
          ))}
      </Box>
    </Box>
  );
};

export default TopArtists;
