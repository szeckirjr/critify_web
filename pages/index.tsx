import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { getSession } from "next-auth/react";
// import { useState } from "react";
import { isAuthenticated } from "../lib/isAuthenticated";
import Dashboard from "../components/dashboard";

const Home: NextPage = ({
  session,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <Dashboard session={session} />;
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
      session,
    },
  };
};
