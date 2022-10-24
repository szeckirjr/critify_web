import { memo, useEffect, useState } from "react";
import gsap from "gsap";
import { Artist } from "../../lib/scraper";
import ScoreCard from "./ScoreCard";

const ArtistCard = ({
  artist,
  index,
}: {
  artist: SpotifyApi.ArtistObjectFull;
  index: number;
}): JSX.Element => {
  const [metaInfo, setMetaInfo] = useState<Artist>();
  const [loading, setLoading] = useState<boolean>(true);
  // useEffect(() => {
  //   getArtist(artist.name).then((res) => {
  //     setMetaInfo(res as Artist);
  //   });
  // }, [artist]);

  useEffect(() => {
    fetch(`/api/artist/${artist.name}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        setMetaInfo(res.artist);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [artist]);

  useEffect(() => {
    gsap.fromTo(
      ".fade-up",
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "slow",
        // ease: CustomEase.create(
        //   "custom",
        //   "M0,0 C0,0 0.071,0.189 0.136,0.288 0.384,0.665 0.202,0.914 0.476,1.17 0.613,1.298 0.648,0.976 0.762,0.924 0.937,0.843 1,1 1,1 "
        // ),
        stagger: 0.04,
      }
    );
  }, [artist, index]);

  //artist.images[0].url
  //metaInfo?.avgCareerScore

  return (
    <ScoreCard
      title={artist.name}
      score={metaInfo?.avgCareerScore}
      imageUrl={artist.images[0].url}
      loading={loading}
      index={index}
      animate
    />
  );
};

export default memo(ArtistCard);
