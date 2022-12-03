import { createSlice } from "@reduxjs/toolkit";
import { Album, Artist, getCleanName } from "../../lib/scraper";

interface MetacriticState {
  artists: {
    [aristName: string]: Artist;
  };
  albums: {
    [artistName: string]: Album[];
  };
}

const initialState: MetacriticState = {
  artists: {},
  albums: {},
};

const metacriticSlice = createSlice({
  name: "metacritic",
  initialState,
  reducers: {
    setAlbums: (state, action) => {
      state.albums = action.payload;
    },
    setArtists: (state, action) => {
      state.artists = action.payload;
    },
    upsertArtist: (state, action) => {
      if (action.payload) {
        const artist = action.payload as Artist;
        state.artists[getCleanName(artist.name)] = artist;
      }
    },
  },
  // extraReducers: {
  //   [scrapeArtist.fulfilled.type]: (state, action) => {
  //     if (action.payload) {
  //       console.log("Got the following artist", action.payload);
  //       const artist = action.payload as Artist;
  //       const cleanName = getCleanName(artist.name);
  //       state.artists[cleanName] = artist;
  //     }
  //   },
  // },
});

export default metacriticSlice;

export const { setAlbums, setArtists, upsertArtist } = metacriticSlice.actions;
