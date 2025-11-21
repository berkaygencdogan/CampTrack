import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: null,
    email: "",
    token: null,
    userInfo: {},
    isLoggedIn: false,
    notificationCount: 0,
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
    setNotificationCount: (state, action) => {
      state.notificationCount = action.payload;
    },
  },
});

export const { setAuthData, logoutUser, setNotificationCount } =
  userSlice.actions;
export default userSlice.reducer;
