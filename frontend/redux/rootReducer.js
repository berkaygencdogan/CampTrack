import { combineReducers } from "@reduxjs/toolkit";
import user from "./userSlice"; // default export olduğu için istediğin isimle alabilirsin
import backpack from "./backpackSlice";
import onboard from "./onboardSlice";
const rootReducer = combineReducers({
  user,
  backpack,
  onboard,
});

export default rootReducer;
