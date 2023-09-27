"use client";

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Features/user/userSlice";
import profilePictureReducer from "./Features/profilePicture/profilePictureSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    profilePicture: profilePictureReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
