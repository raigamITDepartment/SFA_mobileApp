import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UnproductiveCallState {
  loading: boolean;
  success: boolean;
  error: any | null;
  data: any | null;
}

const initialState: UnproductiveCallState = {
  loading: false,
  success: false,
  error: null,
  data: null,
};

const unproductiveCallSlice = createSlice({
  name: 'unproductiveCall',
  initialState,
  reducers: {
    setUnproductiveCallLoading: (state) => {
      state.loading = true;
      state.success = false;
      state.error = null;
    },
    setUnproductiveCallSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.success = true;
      state.data = action.payload;
    },
    setUnproductiveCallError: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
    resetUnproductiveCallState: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setUnproductiveCallLoading,
  setUnproductiveCallSuccess,
  setUnproductiveCallError,
  resetUnproductiveCallState,
} = unproductiveCallSlice.actions;

export default unproductiveCallSlice.reducer;