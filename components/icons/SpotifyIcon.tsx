import Box from "@mui/material/Box";
import Icon, { IconProps } from "@mui/material/Icon/Icon";
import Image from "next/image";

const SpotifyIcon = (props: IconProps) => (
  <Box>
    <Icon
      {...props}
      sx={{
        textAlign: "center",
      }}
    >
      <Image
        alt="Spotify Logo"
        src="/spotify-icon.svg"
        style={{
          display: "flex",
          height: "inherit",
          width: "inherit",
        }}
      />
    </Icon>
  </Box>
);

export default SpotifyIcon;
