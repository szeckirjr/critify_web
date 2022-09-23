import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import gsap from "gsap";
import ScaleHover from "../ScaleHover";

const AlbumCard = ({
  album,
  index,
}: {
  album: SpotifyApi.AlbumObjectFull;
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
            {index + 1}. {album.name}
          </Typography>
        </Box>
      </Box>
    </ScaleHover>
  );
};

export default AlbumCard;
