
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Items: [],
  loading: false,
  error: null,
};

const outletSlice = createSlice({
  name: "fetchItems",
  initialState,
  reducers: {
    setItemsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setItemsSuccess: (state, { payload }) => {
      state.loading = false;
      state.Items = payload; // payload is the array from API response
      state.error = null;
      console.log("set Items Success payload:", payload); // Log the payload
      //console.log("Updated state.outlet iiiiiiiiiiiiiiiiiiii:", state.outlet); // Log the updated state
    },
    setItemsError: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  },
});

export const { setItemsLoading, setItemsSuccess, setItemsError  } = outletSlice.actions;
export default outletSlice.reducer;