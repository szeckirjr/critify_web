import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import gsap from "gsap";
import ScaleHover from "../ScaleHover";
import { Album, Artist, getAlbumInfo, getArtist } from "../../lib/scraper";

const ArtistCard = ({
  artist,
  index,
}: {
  artist: SpotifyApi.ArtistObjectFull;
  index: number;
}): JSX.Element => {
  const [metaInfo, setMetaInfo] = useState<Artist>();
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

  const [scoreColor, setScoreColor] = useState<
    "#D2222D" | "#FFBF00" | "#008000" | "gray"
  >("gray");

  useEffect(() => {
    if (!metaInfo?.avgCareerScore) setScoreColor("gray");
    if (metaInfo?.avgCareerScore && metaInfo?.avgCareerScore >= 70) {
      setScoreColor("#008000");
    } else if (metaInfo?.avgCareerScore && metaInfo?.avgCareerScore >= 50) {
      setScoreColor("#FFBF00");
    } else if (metaInfo?.avgCareerScore && metaInfo?.avgCareerScore >= 30) {
      setScoreColor("#D2222D");
    } else {
      setScoreColor("gray");
    }
  }, [metaInfo]);

  return (
    <ScaleHover>
      <Box
        className="fade-up"
        flex="none"
        height={150}
        width={150}
        bgcolor="pink"
        borderRadius={2}
        sx={{
          backgroundImage: `url(${artist.images[0].url})`,
          backgroundSize: "cover",
          cursor: "pointer",
        }}
        display="flex"
      >
        <Box
          px={1}
          borderRadius={2}
          position="absolute"
          right={8}
          top={3}
          bgcolor={scoreColor}
        >
          <Typography fontSize={28} fontWeight="medium">
            {metaInfo?.avgCareerScore}
          </Typography>
        </Box>
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          borderRadius={2}
          sx={{
            backgroundImage: !metaInfo?.avgCareerScore
              ? "linear-gradient(180deg, rgba(131, 131, 131, 0.9), rgba(131, 131, 131, 0.9))"
              : "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%)",
          }}
        >
          <Typography
            variant="h6"
            lineHeight={1.1}
            sx={{
              paddingX: 1,
              paddingY: 0.5,
            }}
            color="white"
          >
            {index + 1}. {artist.name}{" "}
            {metaInfo && (metaInfo as any).avgCareerScore}
          </Typography>
        </Box>
      </Box>
    </ScaleHover>
  );
};

export default ArtistCard;
