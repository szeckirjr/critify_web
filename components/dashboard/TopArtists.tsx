import { Box } from "@mui/material";
import { useEffect } from "react";
import {
  getTopArtistsLongTerm,
  getTopArtistsMediumTerm,
  getTopArtistsShortTerm,
} from "../../redux/slices/spotify";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { MySession, Range } from "../../types/types";
import ArtistCard from "./ArtistCard";

type Props = {
  range: Range;
  session: MySession;
};

const TopArtists = ({ session, range }: Props) => {
  const topArtistsLongTerm = useAppSelector((state) => state.spotify.longTerm);
  const topArtistsMediumTerm = useAppSelector(
    (state) => state.spotify.mediumTerm
  );
  const topArtistsShortTerm = useAppSelector(
    (state) => state.spotify.shortTerm
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!topArtistsLongTerm || topArtistsLongTerm.length === 0) {
      dispatch(getTopArtistsLongTerm(session));
    }
    if (!topArtistsMediumTerm || topArtistsMediumTerm.length === 0) {
      dispatch(getTopArtistsMediumTerm(session));
    }
    if (!topArtistsShortTerm || topArtistsShortTerm.length === 0) {
      dispatch(getTopArtistsShortTerm(session));
    }
  }, [
    dispatch,
    session,
    topArtistsLongTerm,
    topArtistsMediumTerm,
    topArtistsShortTerm,
  ]);

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
