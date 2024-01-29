import { createSlice } from "@reduxjs/toolkit";
const user = JSON.parse(localStorage.getItem("token")) || null;
const initialState = {
  id: user?.user?._id || null,
  name: user?.user?.name || null,
  email: user?.user?.email,
  avatar: user?.user?.avatar || null,
  background: user?.user?.background || null,
};
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logUser: (state, action) => {
      state.id = action.payload._id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
      state.background = action.payload.background;
    },
    background: (state, action) => {
      state.background = action.payload;
    },
  },
});
export const { logUser, background } = userSlice.actions;
