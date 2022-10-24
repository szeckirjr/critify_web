import { memo, useEffect, useState } from "react";
import gsap from "gsap";
import { Album } from "../../lib/scraper";
import ScoreCard from "./ScoreCard";

const AlbumCard = ({
  album,
  showAll,
}: {
  album: SpotifyApi.AlbumObjectFull;
  showAll: boolean;
}): JSX.Element => {
  const [metaInfo, setMetaInfo] = useState<Album>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`/api/album/${album.artists[0].name}/${album.name}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        setMetaInfo(res.album);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [album.artists, album.name]);

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
  }, []);

  return metaInfo || loading || showAll ? (
    <ScoreCard
      title={album.name}
      score={metaInfo?.score}
      imageUrl={album.images[0].url}
      loading={loading}
      animate
    />
  ) : (
    <></>
  );
};

export default memo(AlbumCard);
