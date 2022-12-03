import { memo, useEffect, useState } from "react";
import gsap from "gsap";
import { Album, getCleanName } from "../../lib/scraper";
import ScoreCard from "./ScoreCard";
import { useAppSelector } from "../../redux/store";

type Props = {
  albumName: string;
  artistName: string;
  showAll: boolean;
};

const AlbumCard = ({ albumName, artistName, showAll }: Props): JSX.Element => {
  const [metaInfo, setMetaInfo] = useState<Album>();
  const [loading, setLoading] = useState<boolean>(true);

  const spotifyAlbum = useAppSelector((state) =>
    state.spotify.albums[getCleanName(artistName)]
      ? state.spotify.albums[getCleanName(artistName)][getCleanName(albumName)]
          .album
      : undefined
  );

  useEffect(() => {
    fetch(`/api/album/${artistName}/${albumName}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        setMetaInfo(res.album);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [albumName, artistName]);

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
      title={albumName}
      score={metaInfo?.score}
      imageUrl={spotifyAlbum?.images[0].url ?? ""}
      loading={loading}
      animate
    />
  ) : (
    <></>
  );
};

export default memo(AlbumCard);
