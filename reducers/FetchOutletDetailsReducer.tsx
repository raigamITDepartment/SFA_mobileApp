import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OutletDetails {
  id: number;
  outletName: string;
  ownerName: string;
  mobileNo: string;
  address1: string;
  address2: string;
  address3: string;
  vatNum: string;
  isClose: boolean;
  outletCategoryId: number;
  imagePath?: string;
  // Add any other fields you need from the payload
}

interface OutletDetailsState {
  details: OutletDetails | null;
  loading: boolean;
  error: any | null;
}

const initialState: OutletDetailsState = {
  details: null,
  loading: false,
  error: null,
};

const fetchOutletDetailsSlice = createSlice({
  name: 'outletDetails',
  initialState,
  reducers: {
    setOutletDetailsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setOutletDetailsSuccess: (state, action: PayloadAction<OutletDetails>) => {
      state.loading = false;
      state.details = action.payload;
    },
    setOutletDetailsError: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetOutletDetails: () => initialState,
  },
});

export const {
  setOutletDetailsLoading,
  setOutletDetailsSuccess,
  setOutletDetailsError,
  resetOutletDetails,
} = fetchOutletDetailsSlice.actions;

export default fetchOutletDetailsSlice.reducer;