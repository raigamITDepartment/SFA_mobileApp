import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  success: false, // used to track day-end success
};

const DayStartSlice = createSlice({
  name: "daystart",
  initialState,
  reducers: {
    setDayStartLoading: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    setDayStartSuccess: (state) => {
      state.loading = false;
      state.error = null;
      state.success = true;
    },
    setDayStartError: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      state.success = false;
    },
    resetDayStartState: () => initialState,
  },
});

export const {
  setDayStartLoading,
  setDayStartSuccess,
  setDayStartError,
  resetDayStartState,
} = DayStartSlice.actions;

export default DayStartSlice.reducer;
