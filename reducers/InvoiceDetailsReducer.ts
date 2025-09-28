import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of a single invoice detail
export interface InvoiceDetail {
  // Define the properties of the invoice detail object based on your API response
  // Example:
  id: number;
  invoiceNo: string;
  outletName: string;
  totalBookValue: number;
  invoiceDetailDTOList: any[]; // Define a more specific type for items
  // ... other properties
}

interface InvoiceDetailsState {
  invoice: InvoiceDetail | null;
  loading: boolean;
  error: any | null;
}

const initialState: InvoiceDetailsState = {
  invoice: null,
  loading: false,
  error: null,
};

const invoiceDetailsSlice = createSlice({
  name: 'invoiceDetails',
  initialState,
  reducers: {
    setInvoiceDetailsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setInvoiceDetailsSuccess: (state, action: PayloadAction<InvoiceDetail>) => {
      state.loading = false;
      state.invoice = action.payload;
    },
    setInvoiceDetailsError: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetInvoiceDetails: (state) => {
      state.invoice = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setInvoiceDetailsLoading,
  setInvoiceDetailsSuccess,
  setInvoiceDetailsError,
  resetInvoiceDetails,
} = invoiceDetailsSlice.actions;

export default invoiceDetailsSlice.reducer;