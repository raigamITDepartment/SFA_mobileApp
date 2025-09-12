import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LastInvoice {
  id: number;
  invoiceNo: string;
  dateBook: string;
  dateActual: string;
  totalActualValue: number;
  invoiceType: string;
}

interface LastThreeInvoicesState {
  invoices: LastInvoice[];
  loading: boolean;
  error: any | null;
}

const initialState: LastThreeInvoicesState = {
  invoices: [],
  loading: false,
  error: null,
};

const lastThreeInvoicesSlice = createSlice({
  name: 'lastThreeInvoices',
  initialState,
  reducers: {
    setLastInvoicesLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setLastInvoicesSuccess: (state, action: PayloadAction<LastInvoice[]>) => {
      state.loading = false;
      state.invoices = action.payload || [];
    },
    setLastInvoicesError: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
      state.invoices = [];
    },
  },
});

export const { setLastInvoicesLoading, setLastInvoicesSuccess, setLastInvoicesError } = lastThreeInvoicesSlice.actions;
export default lastThreeInvoicesSlice.reducer;