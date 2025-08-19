
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  Price: [],
  loading: false,
  error: null,
};

const priceSlice = createSlice({
  name: "fetchPrice",
  initialState,
  reducers: {
    setPriceLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setPriceSuccess: (state, { payload }) => {
      state.loading = false;
      state.Price = payload; // payload is the array from API response
      state.error = null;
      console.log("set Items Success payload:", payload); // Log the payload
      //console.log("Updated state.outlet iiiiiiiiiiiiiiiiiiii:", state.outlet); // Log the updated state
    },
    setPriceError: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  },
});

export const { setPriceLoading, setPriceSuccess, setPriceError  } = priceSlice.actions;
export default priceSlice.reducer;