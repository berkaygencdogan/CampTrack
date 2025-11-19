import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: null,
    email: "",
    token: null,
    isLoggedIn: false,
  },

  reducers: {
    setAuthData: (state, action) => {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.isLoggedIn = true;
      state.userInfo = action.payload.user;
    },

    logoutUser: (state) => {
      state.userId = null;
      state.email = "";
      state.token = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setAuthData, logoutUser } = userSlice.actions;
export default userSlice.reducer;
