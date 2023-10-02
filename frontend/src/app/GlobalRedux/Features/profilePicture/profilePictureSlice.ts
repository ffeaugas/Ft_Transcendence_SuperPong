"use client";

import { createSlice } from "@reduxjs/toolkit";

export interface ProfilePictureState {
  profilePicture: string | undefined;
}

const initialState: ProfilePictureState = {
  profilePicture: undefined,
};

export const profilePictureSlice = createSlice({
  name: "profilePicture",
  initialState,
  reducers: {
    setProfilePicture: (state: any, action: { payload: any }) => {
      state.profilePicture = action.payload;
    },
  },
});

export const { setProfilePicture } = profilePictureSlice.actions;
export default profilePictureSlice.reducer;
