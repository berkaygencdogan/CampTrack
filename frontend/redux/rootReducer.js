import { combineReducers } from "@reduxjs/toolkit";
import user from "./userSlice"; // default export olduğu için istediğin isimle alabilirsin
import backpack from "./backpackSlice";
const rootReducer = combineReducers({
  user,
  backpack,
});

export default rootReducer;
