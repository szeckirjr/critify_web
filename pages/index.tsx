import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@mui/system";
import { Button } from "@mui/material";
import { ApolloError, gql, useQuery } from "@apollo/client";
import LoginPage from "../components/auth/login";
import { useCallback } from "react";
import React from "react";

const Home: NextPage = () => {
  return <LoginPage />;
};

export default Home;
