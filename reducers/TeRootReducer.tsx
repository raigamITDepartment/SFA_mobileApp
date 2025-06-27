import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  routes: [],
  loading: false,
  error: null,
};

const outletSlice = createSlice({
  name: "outlet",
  initialState,
  reducers: {
    setRoutesLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setRoutesSuccess: (state, { payload }) => {
      state.loading = false;
      state.routes = payload; // payload is the array from API response
      state.error = null;
      console.log("setRoutesSuccess payload:", payload); // Log the payload
      console.log("Updated state.routes:", state.routes); // Log the updated state
    },
    setRoutesError: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  },
});

export const { setRoutesLoading, setRoutesSuccess, setRoutesError } = outletSlice.actions;
export default outletSlice.reducer;