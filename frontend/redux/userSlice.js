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
    language: "en",
  },

  reducers: {
    setAuthData: (state, action) => {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.isLoggedIn = true;
      state.userInfo = action.payload.user;
    },
    setUserInfo: (state, action) => {
      state.userInfo = {
        ...state.userInfo,
        ...action.payload,
      };
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
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});

export const {
  setAuthData,
  logoutUser,
  setNotificationCount,
  setLanguage,
  setUserInfo,
} = userSlice.actions;
export default userSlice.reducer;
