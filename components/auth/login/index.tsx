import { ApolloError, gql, useQuery } from "@apollo/client";
import {
  Button,
  Icon,
  Stack,
  SvgIcon,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useRef } from "react";
import SpotifyIcon from "../../icons/SpotifyIcon";
import { gsap } from "gsap";

const LoginPage = (): JSX.Element => {
  const email = "adrianaszeckir@gmail.com";
  const password = "adriana10aaaa";

  const [data, setData] = React.useState<any>(undefined);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<ApolloError | undefined>(undefined);

  const handleLogin = () => {
    const SIGN_IN = gql`
      query SignIn($email: String!, $password: String!) {
        signIn(email: $email, password: $password) {
          status
          message
        }
      }
    `;
    const { data, loading, error } = useQuery(SIGN_IN, {
      variables: { email, password },
    });
    setData(data);
    setLoading(loading);
    setError(error);
  };

  console.log(data, loading, error);

  const theme = useTheme();

  useEffect(() => {
    gsap.fromTo(
      ".fade-up",
      { opacity: 0, y: 200 },
      { opacity: 1, y: 0, duration: 1.5, delay: 0.5, stagger: 0.5 }
    );
  });

  return (
    <Stack
      direction="column"
      gap={3}
      bgcolor={theme.spotify.black}
      minHeight="100vh"
      justifyContent="center"
    >
      <Typography
        className="fade-up"
        mx="auto"
        fontSize={56}
        fontWeight="bold"
        color={theme.spotify.green}
      >
        Critify
      </Typography>
      <Typography
        className="fade-up"
        textAlign="center"
        fontSize={24}
        fontWeight="bold"
        color="white"
      >
        Get reviews and scores of your most listened to artists and albums
      </Typography>
      <Button
        className="fade-up"
        variant="contained"
        startIcon={
          // <SpotifyIcon
          //   sx={{
          //     height: 30,
          //     width: 30,
          //   }}
          // />
          <img
            src="/spotify-icon.svg"
            style={{
              filter:
                "invert(100%) sepia(5%) saturate(7500%) hue-rotate(283deg) brightness(108%) contrast(111%)",
              height: 30,
              width: 30,
            }}
          />
        }
        sx={{
          paddingY: 1,
          paddingX: 4,
          color: "white",
          mx: "auto",
          maxWidth: 700,
          borderRadius: 2,
          bgcolor: theme.spotify.green,
          "&:hover": {
            bgcolor: theme.spotify.darkGreen,
          },
        }}
      >
        Login with Spotify
      </Button>
    </Stack>
  );
};

export default LoginPage;
