import { createSlice } from "@reduxjs/toolkit";

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
  },
  reducers: {
    setNotifications: (state, action) => {
      state.items = action.payload;
    },
  },
});

export const { setNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
