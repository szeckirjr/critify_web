import "../styles/globals.css";
import type { AppProps } from "next/app";
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { createTheme, ThemeProvider } from "@mui/material";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { Provider } from "react-redux";
import store from "../redux/store";

const httpLink = new HttpLink({
  uri: "http://localhost:4000",
});

const client = new ApolloClient({
  link: ApolloLink.from([httpLink]),
  cache: new InMemoryCache(),
});

declare module "@mui/material/styles" {
  interface Theme {
    spotify: {
      green: string;
      darkGreen: string;
      black: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    spotify?: {
      green?: string;
      darkGreen?: string;
      black?: string;
    };
  }
}

const theme = createTheme({
  spotify: {
    green: "#1ed760",
    darkGreen: "#1DB954", //00802d
    black: "#191414",
  },
});

function MyApp({
  Component,
  pageProps,
}: AppProps<{
  session: Session;
}>) {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <SessionProvider session={pageProps.session}>
          <Provider store={store}>
            <Component {...pageProps} />
          </Provider>
        </SessionProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default MyApp;
