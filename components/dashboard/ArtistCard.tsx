import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import gsap from "gsap";
import ScaleHover from "../ScaleHover";
import CustomEase from "gsap/CustomEase";

const ArtistCard = ({
  artist,
  index,
}: {
  artist: SpotifyApi.ArtistObjectFull;
  index: number;
}): JSX.Element => {
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
          flex={1}
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          borderRadius={2}
          sx={{
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.65) 100%)",
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
            {index + 1}. {artist.name}
          </Typography>
        </Box>
      </Box>
    </ScaleHover>
  );
};

export default ArtistCard;
