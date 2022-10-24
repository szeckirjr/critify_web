import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { getSession } from "next-auth/react";
import { customGet } from "../lib/customGet";
// import { useState } from "react";
import { isAuthenticated } from "../lib/isAuthenticated";
import Dashboard from "../components/dashboard";

const Home: NextPage = ({
  user,
  spotifyUser,
  topArtistsLongTerm,
  topArtistsMediumTerm,
  topArtistsShortTerm,
  savedAlbums,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Dashboard
      spotifyUser={spotifyUser}
      user={user}
      topArtistsLongTerm={topArtistsLongTerm}
      topArtistsMediumTerm={topArtistsMediumTerm}
      topArtistsShortTerm={topArtistsShortTerm}
      savedAlbums={savedAlbums}
    />
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!(await isAuthenticated(session))) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // await Promise.all([
  //   customGet("https://api.spotify.com/v1/me", session),
  //   customGet(
  //     "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50",
  //     session
  //   ),
  //   customGet(
  //     "https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=50",
  //     session
  //   ),
  //   customGet(
  //     "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=50",
  //     session
  //   ),
  //   customGet(
  //     "https://api.spotify.com/v1/me/albums?limit=50&offset=0",
  //     session
  //   ),
  // ]).then((values) => {
  //   return {
  //     props: {
  //       spotifyUser: values[0],
  //       user: session?.user,
  //       topArtistsLongTerm: values[1],
  //       topArtistsMediumTerm: values[2],
  //       topArtistsShortTerm: values[3],
  //       savedAlbums: values[4],
  //     },
  //   };
  // });

  const spotifyUser = await customGet("https://api.spotify.com/v1/me", session);

  const topArtistsLongTerm = await customGet(
    "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50",
    session
  );

  const topArtistsMediumTerm = await customGet(
    "https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=50",
    session
  );

  const topArtistsShortTerm = await customGet(
    "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=50",
    session
  );

  const savedAlbums = await customGet(
    "https://api.spotify.com/v1/me/albums?limit=50",
    session
  );

  // Cache the content of this page for 12 hrs
  // After 12 hrs, the content will continue to be served
  // for a grace period of 60 seconds as new data is fetched
  // Then, the CDN will store a fresh copy for the next user :-)
  ctx.res.setHeader(
    "Cache-Control",
    "public, s-maxage=43200, stale-while-revalidate=60"
  );

  return {
    props: {
      spotifyUser,
      user: session?.user,
      topArtistsLongTerm,
      topArtistsMediumTerm,
      topArtistsShortTerm,
      savedAlbums,
    },
  };
};
