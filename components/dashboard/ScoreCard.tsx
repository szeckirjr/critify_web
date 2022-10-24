import { Box, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ScaleHover from "../ScaleHover";

type Props = {
  index?: number;
  imageUrl: string;
  score?: number;
  loading: boolean;
  title: string;
  size?: number;
  animate?: boolean;
  disableHover?: boolean;
};

export default function ScoreCard({
  index,
  imageUrl,
  score,
  loading,
  title,
  size,
  animate,
  disableHover,
}: Props) {
  const [scoreColor, setScoreColor] = useState<
    "#D2222D" | "#FFBF00" | "#008000" | "gray"
  >("gray");

  useEffect(() => {
    if (!score) setScoreColor("gray");
    else if (score >= 70) {
      setScoreColor("#008000");
    } else if (score >= 50) {
      setScoreColor("#FFBF00");
    } else if (score >= 30) {
      setScoreColor("#D2222D");
    } else {
      setScoreColor("gray");
    }
  }, [score]);
  return (
    <ScaleHover disable={disableHover ?? false}>
      <Box
        className={animate ? "fade-up" : ""}
        flex={index === 2 ? 3 : "none"}
        height={size ?? 150}
        width={size ?? 150}
        bgcolor="pink"
        borderRadius={2}
        sx={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          cursor: disableHover ? "default" : "pointer",
        }}
        display="flex"
      >
        <Box
          px={1}
          borderRadius={2}
          position="absolute"
          right={8}
          top={3}
          color="white"
          bgcolor={loading ? "transparent" : scoreColor}
        >
          {loading ? (
            <CircularProgress color="inherit" size={28} />
          ) : (
            <Typography fontSize={28} fontWeight="medium">
              {score}
            </Typography>
          )}
        </Box>
        <Box
          flex={1}
          display="flex"
          flexDirection="column"
          justifyContent="flex-end"
          borderRadius={2}
          sx={{
            backgroundImage: !score
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
            {index ? `${index + 1}. ` : ""}
            {title}
          </Typography>
        </Box>
      </Box>
    </ScaleHover>
  );
}
