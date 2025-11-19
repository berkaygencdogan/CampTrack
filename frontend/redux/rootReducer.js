import { combineReducers } from "@reduxjs/toolkit";
import user from "./userSlice"; // default export olduğu için istediğin isimle alabilirsin

const rootReducer = combineReducers({
  user,
});

export default rootReducer;
