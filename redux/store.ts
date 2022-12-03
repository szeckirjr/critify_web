import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import metacriticSlice from "./slices/metacritic";
import spotifySlice from "./slices/spotify";

// config the store
const store = configureStore({
  reducer: {
    spotify: spotifySlice.reducer,
    metacritic: metacriticSlice.reducer,
  },
});

// export default the store
export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// TypeScript safe hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
