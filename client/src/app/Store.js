import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "../slices/userSlice";
export const Store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});
