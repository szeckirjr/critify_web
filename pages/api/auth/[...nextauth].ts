import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

const scopes = [
  "user-read-private",
  "user-read-email",
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-top-read",
  "user-read-recently-played",
  "user-library-read",
];
const scopesString = scopes.join(" ");

export default NextAuth({
  providers: [
    SpotifyProvider({
      // authorization: `https://accounts.spotify.com/authorize?scope=${scopesString}`,
      authorization: {
        params: {
          scope: scopesString,
        },
      },
      clientId: process.env.SPOTIFY_CLIENT_ID ?? "",
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.id = account.id;
        token.expires_at = account.expires_at;
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // console.log("Got the following user", user);
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
