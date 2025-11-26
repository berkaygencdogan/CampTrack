import { createSlice } from "@reduxjs/toolkit";

const backpackSlice = createSlice({
  name: "backpack",

  initialState: {
    items: [],
    lastSync: null,
  },

  reducers: {
    setBackpack: (state, action) => {
      state.items = action.payload;
      state.lastSync = Date.now();
    },

    addToBackpack: (state, action) => {
      const item = action.payload;
      if (!state.items.some((i) => i.id === item.id)) {
        state.items.push(item);
      }
    },

    removeFromBackpack: (state, action) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
  },
});

export const { setBackpack, addToBackpack, removeFromBackpack } =
  backpackSlice.actions;

export default backpackSlice.reducer;
