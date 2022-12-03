import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { customGet } from "../../lib/customGet";
import { getCleanName } from "../../lib/scraper";
import { MySession } from "../../types/types";

// Create the thunk to get spotify user data
export const getSpotifyUserData = createAsyncThunk(
  "spotify/getSpotifyUserData",
  async (session: MySession) => {
    const data = await customGet("https://api.spotify.com/v1/me", session);
    return data;
  }
);

export const getTopArtistsLongTerm = createAsyncThunk(
  "spotify/getTopArtistsLongTerm",
  async (session: MySession) => {
    const data = await customGet(
      "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50",
      session
    );
    return data;
  }
);

export const getTopArtistsMediumTerm = createAsyncThunk(
  "spotify/getTopArtistsMediumTerm",
  async (session: MySession) => {
    const data = await customGet(
      "https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=50",
      session
    );
    return data;
  }
);

export const getTopArtistsShortTerm = createAsyncThunk(
  "spotify/getTopArtistsShortTerm",
  async (session: MySession) => {
    const data = await customGet(
      "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=50",
      session
    );
    return data;
  }
);

export const getSavedAlbums = createAsyncThunk(
  "spotify/getSavedAlbums",
  async (session: MySession) => {
    const data = await customGet(
      "https://api.spotify.com/v1/me/albums?limit=50",
      session
    );
    return data;
  }
);

interface SpotifyState {
  shortTerm: SpotifyApi.ArtistObjectFull[];
  mediumTerm: SpotifyApi.ArtistObjectFull[];
  longTerm: SpotifyApi.ArtistObjectFull[];
  artists: {
    [artistName: string]: SpotifyApi.ArtistObjectFull;
  };
  albums: {
    [artistName: string]: {
      [albumName: string]: SpotifyApi.SavedAlbumObject;
    };
  };
  savedAlbums: SpotifyApi.SavedAlbumObject[];
  user?: SpotifyApi.CurrentUsersProfileResponse;
}

const initialState = {
  shortTerm: [],
  mediumTerm: [],
  longTerm: [],
  savedAlbums: [],
  artists: {},
  albums: {},
  user: undefined,
} as SpotifyState;

const spotifySlice = createSlice({
  name: "spotify",
  initialState,
  reducers: {
    setShortTerm: (state, action) => {
      state.shortTerm = action.payload;
    },
    setMediumTerm: (state, action) => {
      state.mediumTerm = action.payload;
    },
    setLongTerm: (state, action) => {
      state.longTerm = action.payload;
    },
    setArtists: (state, action) => {
      state.artists = action.payload;
    },
  },
  extraReducers: {
    [getSpotifyUserData.fulfilled.type]: (state, action) => {
      state.user = action.payload;
    },
    [getTopArtistsLongTerm.fulfilled.type]: (state, action) => {
      const longTermList = action.payload.items;
      if (longTermList) {
        state.longTerm = longTermList;
        longTermList.forEach((artist: SpotifyApi.ArtistObjectFull) => {
          state.artists[getCleanName(artist.name)] = artist;
        });
      }
    },
    [getTopArtistsMediumTerm.fulfilled.type]: (state, action) => {
      const mediumTermList = action.payload.items;
      if (mediumTermList) {
        state.mediumTerm = mediumTermList;
        mediumTermList.forEach((artist: SpotifyApi.ArtistObjectFull) => {
          state.artists[getCleanName(artist.name)] = artist;
        });
      }
    },
    [getTopArtistsShortTerm.fulfilled.type]: (state, action) => {
      const shortTermList = action.payload.items;
      if (shortTermList) {
        state.shortTerm = shortTermList;
        shortTermList.forEach((artist: SpotifyApi.ArtistObjectFull) => {
          state.artists[getCleanName(artist.name)] = artist;
        });
      }
    },
    [getSavedAlbums.fulfilled.type]: (state, action) => {
      const savedAlbums = action.payload.items;
      state.savedAlbums = savedAlbums;
      if (savedAlbums) {
        savedAlbums.forEach((album: SpotifyApi.SavedAlbumObject) => {
          const artistName = getCleanName(album.album.artists[0].name);
          const albumName = getCleanName(album.album.name);
          if (!state.albums[artistName]) {
            state.albums[artistName] = {};
          }
          state.albums[artistName][albumName] = album;
        });
      }
    },
  },
});

export default spotifySlice;

export const spotifyAction = spotifySlice.actions;
