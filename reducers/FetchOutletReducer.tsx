import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  outlets: [],
  loading: false,
  error: null,
};

const outletSlice = createSlice({
  name: "fetchoutlet",
  initialState,
  reducers: {
    setOutletLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setOutletSuccess: (state, { payload }) => {
      state.loading = false;
      state.outlets = payload; // payload is the array from API response
      state.error = null;
      //console.log("setOutletSuccess payload:", payload); // Log the payload
      //console.log("Updated state.outlet iiiiiiiiiiiiiiiiiiii:", state.outlet); // Log the updated state
    },
    setOutletError: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  },
});

export const { setOutletLoading, setOutletSuccess, setOutletError } = outletSlice.actions;
export default outletSlice.reducer;