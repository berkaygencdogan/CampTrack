import axios from "axios";
import {
  addToBackpack,
  removeFromBackpack,
  setBackpack,
} from "../redux/backpackSlice";

const API = process.env.EXPO_PUBLIC_API_URL;

// --------------------------
// FETCH (Backend → Redux)
// --------------------------
export const syncFetchBackpack = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`${API}/backpack/${userId}`);

    if (res.data?.items) {
      dispatch(setBackpack(res.data.items));
    }
  } catch (err) {
    console.log("SYNC_FETCH_BACKPACK_ERROR:", err);
  }
};

// --------------------------
// ADD ITEM
// --------------------------
export const syncAddItem = (userId, item) => async (dispatch) => {
  try {
    await axios.post(`${API}/backpack/add`, {
      userId: userId,
      item: item,
    });

    dispatch(addToBackpack(item));
  } catch (err) {
    console.log("SYNC_ADD_ITEM_ERROR:", err);
  }
};

// --------------------------
// REMOVE ITEM
// --------------------------
export const syncRemoveItem = (userId, itemId) => async (dispatch) => {
  try {
    await axios.post(`${API}/backpack/remove`, {
      userId: userId,
      itemId: itemId,
    });

    dispatch(removeFromBackpack(itemId));
  } catch (err) {
    console.log("SYNC_REMOVE_ITEM_ERROR:", err);
  }
};
