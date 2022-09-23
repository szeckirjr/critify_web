import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import gsap from "gsap";
import ScaleHover from "../ScaleHover";
import { Album } from "../../lib/scraper";

const AlbumCard = ({
  album,
}: {
  album: SpotifyApi.AlbumObjectFull;
}): JSX.Element => {
  const [metaInfo, setMetaInfo] = useState<Album>();

  useEffect(() => {
    fetch(`/api/album/${album.artists[0].name}/${album.name}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        setMetaInfo(res.album);
      });
  }, [album]);

  const [scoreColor, setScoreColor] = useState<
    "#D2222D" | "#FFBF00" | "#008000" | "gray"
  >("gray");

  useEffect(() => {
    if (!metaInfo?.score) setScoreColor("gray");
    if (metaInfo?.score && metaInfo?.score >= 70) {
      setScoreColor("#008000");
    } else if (metaInfo?.score && metaInfo?.score >= 50) {
      setScoreColor("#FFBF00");
    } else if (metaInfo?.score && metaInfo?.score >= 30) {
      setScoreColor("#D2222D");
    } else {
      setScoreColor("gray");
    }
  }, [metaInfo]);

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

  return (
    <ScaleHover>
      <Box
        className="fade-up"
        flex="none"
        height={150}
        width={150}
        borderRadius={2}
        boxShadow={2}
        sx={{
          backgroundImage: `url(${album.images[0].url})`,
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
            {metaInfo?.score}
          </Typography>
        </Box>
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          borderRadius={2}
          sx={{
            backgroundImage: !metaInfo?.score
              ? "linear-gradient(180deg, rgba(75, 75, 75, 0.9), rgba(75, 75, 75, 0.9))"
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
            {album.name}
          </Typography>
        </Box>
      </Box>
    </ScaleHover>
  );
};

export default AlbumCard;
