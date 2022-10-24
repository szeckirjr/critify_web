import { Button, Typography, Stack, useTheme, Box } from "@mui/material";
import { NextPage } from "next";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useEffect } from "react";
import gsap from "gsap";

const Login: NextPage = () => {
  const handleLogin = () => {
    signIn("spotify", {
      callbackUrl: process.env.CALLBACK_URL ?? "http://localhost:3000",
    });
  };

  useEffect(() => {
    gsap.fromTo(
      ".fade-up",
      { opacity: 0, y: 200 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        stagger: 0.4,
        ease: "circ",
      }
    );
  });

  const theme = useTheme();
  return (
    <Stack
      direction="column"
      gap={3}
      bgcolor={theme.spotify.black}
      minHeight="100vh"
      alignItems="center"
      justifyContent="center"
    >
      <Typography
        className="fade-up"
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
          <Image
            alt="Spotify Icon"
            src="/spotify-icon.svg"
            height={30}
            width={30}
            style={{
              filter:
                "invert(100%) sepia(5%) saturate(7500%) hue-rotate(283deg) brightness(108%) contrast(111%)",
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
        onClick={handleLogin}
      >
        Sign In
      </Button>
      <a href="https://wardo.dev/" target="_blank" rel="noreferrer">
        <Box
          sx={{
            opacity: 0.3,
            cursor: "pointer",
            transition: "opacity 0.3s ease",
            "&:hover": {
              opacity: 0.8,
            },
            transform: "translateX(-50%)",
          }}
          bottom={15}
          position="fixed"
          //   left="50%"
        >
          <Typography
            mt={8}
            className="fade-up"
            fontSize={18}
            fontWeight="bold"
            color="white"
          >
            by wardo.dev
          </Typography>
        </Box>
      </a>
    </Stack>
  );
};

export default Login;
