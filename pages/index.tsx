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
  topArtistsLongTerm,
  topArtistsMediumTerm,
  topArtistsShortTerm,
  savedAlbums,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <Dashboard
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

  const savedAlbums: SpotifyApi.AlbumObjectFull = await customGet(
    "https://api.spotify.com/v1/me/albums?limit=50",
    session
  );

  return {
    props: {
      user: session?.user,
      topArtistsLongTerm,
      topArtistsMediumTerm,
      topArtistsShortTerm,
      savedAlbums,
    },
  };
};
