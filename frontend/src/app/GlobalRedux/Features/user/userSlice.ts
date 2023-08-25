"use client";

import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  username: string | undefined;
}

const initialState: UserState = {
  username: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsername: (state: any, action: { payload: any }) => {
      state.username = action.payload;
    },
  },
});

export const { setUsername } = userSlice.actions;
export default userSlice.reducer;
