import { memo, useEffect, useState } from "react";
import gsap from "gsap";
import { getCleanName } from "../../lib/scraper";
import ScoreCard from "./ScoreCard";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { upsertArtist } from "../../redux/slices/metacritic";
import { Box } from "@mui/material";
import { useRouter } from "next/router";

const ArtistCard = ({
  artist,
  index,
}: {
  artist: SpotifyApi.ArtistObjectFull;
  index: number;
}): JSX.Element => {
  const [loading, setLoading] = useState<boolean>(true);

  const metaInfo = useAppSelector(
    (state) => state.metacritic.artists[getCleanName(artist.name)]
  );

  const dispatch = useAppDispatch();

  const router = useRouter();

  useEffect(() => {
    if (!metaInfo) {
      fetch(`/api/artist/${artist.name}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.artist) dispatch(upsertArtist(res.artist));
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [artist.name, dispatch, metaInfo]);

  useEffect(() => {
    gsap.fromTo(
      ".fade-up",
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "slow",
        stagger: 0.04,
      }
    );
  }, [artist, index]);

  return (
    <Box
      onClick={() =>
        metaInfo && router.push(`/artist/${getCleanName(artist.name)}`)
      }
    >
      <ScoreCard
        title={artist.name}
        score={metaInfo?.avgCareerScore}
        imageUrl={artist.images[0].url}
        loading={loading}
        index={index}
        animate
        disableHover={metaInfo ? false : true}
      />
    </Box>
  );
};

export default memo(ArtistCard);
