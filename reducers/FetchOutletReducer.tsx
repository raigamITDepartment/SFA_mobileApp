import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OutletType {
  id: number;
  outletName: string;
}

const initialState = {
  outlets: [] as OutletType[],
  loading: false,
  error: null,
};

const fetchOutletSlice = createSlice({
  name: "fetchOutlet",
  initialState,
  reducers: {
    setOutletLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setOutletSuccess: (state, { payload }: PayloadAction<OutletType[]>) => {
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

export const { setOutletLoading, setOutletSuccess, setOutletError } = fetchOutletSlice.actions;
export default fetchOutletSlice.reducer;