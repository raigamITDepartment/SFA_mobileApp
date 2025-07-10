import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  success: false, // can be used to detect logout completion
};

const logoutSlice = createSlice({
  name: "logout",
  initialState,
  reducers: {
    setLogoutLoading: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    setLogoutSuccess: (state) => {
      state.loading = false;
      state.error = null;
      state.success = true;
    },
    setLogoutError: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
      state.success = false;
    },
    resetLogoutState: () => initialState, // optional: to reset after logout
  },
});

export const {
  setLogoutLoading,
  setLogoutSuccess,
  setLogoutError,
  resetLogoutState,
} = logoutSlice.actions;

export default logoutSlice.reducer;
