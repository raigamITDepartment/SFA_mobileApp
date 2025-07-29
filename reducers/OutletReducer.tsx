import { createSlice } from "@reduxjs/toolkit";

const outletSlice = createSlice({
  name: "outlet",
  initialState: {
    loading: false,
    error: null,
    success: false,
    createdOutlet: null,
    outlets: [],
  },
  reducers: {
    setCreateOutletLoading: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    setCreateOutletSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      console.log("Create Outlet Success Payload:", action.payload);
      state.createdOutlet = action.payload;
    },
    setCreateOutletError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    resetCreateOutletState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.createdOutlet = null;
    },
    setOutletsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setOutletsSuccess: (state, action) => {
      state.loading = false;
      state.outlets = action.payload;
    },
    setOutletsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setCreateOutletLoading,
  setCreateOutletSuccess,
  setCreateOutletError,
  resetCreateOutletState,
  setOutletsLoading,
  setOutletsSuccess,
  setOutletsError,
} = outletSlice.actions;

export default outletSlice.reducer;
