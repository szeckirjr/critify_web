import Box from "@mui/material/Box";
import Icon, { IconProps } from "@mui/material/Icon/Icon";
import SvgIcon, { SvgIconProps } from "@mui/material/SvgIcon";

const SpotifyIcon = (props: IconProps) => (
  <Box>
    <Icon
      {...props}
      sx={{
        textAlign: "center",
      }}
    >
      <img
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
