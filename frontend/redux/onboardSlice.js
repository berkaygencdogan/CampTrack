import { createSlice } from "@reduxjs/toolkit";

const onboardSlice = createSlice({
  name: "onboard",
  initialState: {
    showOnboardScreen: false,
  },
  reducers: {
    setOnboardScreen: (state, action) => {
      state.showOnboardScreen = action.payload;
    },
  },
});

export const { setOnboardScreen } = onboardSlice.actions;
export default onboardSlice.reducer;
