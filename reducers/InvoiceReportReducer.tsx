import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface InvoiceReportItem {
  id: number;
  invoiceNo: string;
  totalBookValue: number;
  invoiceType: string;
  routeName: string;
  outletName: string;
  dateBook: string;
  outletId: number;
  // Add other fields from the API response if needed
}

interface InvoiceReportState {
  invoices: InvoiceReportItem[];
  loading: boolean;
  error: any | null;
}

const initialState: InvoiceReportState = {
  invoices: [],
  loading: false,
  error: null,
};



const invoiceReportSlice = createSlice({
  name: 'invoiceReport',
  initialState,
  reducers: {
    setInvoiceReportLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setInvoiceReportSuccess: (
      state,
      action: PayloadAction<InvoiceReportItem[]>
    ) => {
      state.loading = false;
      state.invoices = action.payload || []; // Ensure state is always an array
      state.error = null;
    },
    setInvoiceReportError: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.invoices = [];
      state.error = action.payload;
    },
  },
});

export const {
  setInvoiceReportLoading,
  setInvoiceReportSuccess,
  setInvoiceReportError,
} = invoiceReportSlice.actions;

export default invoiceReportSlice.reducer;
