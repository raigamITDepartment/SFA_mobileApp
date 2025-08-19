import { createSlice } from "@reduxjs/toolkit";

const invoiceSlice = createSlice({
  name: "Invoice",
  initialState: {
    loading: false,
    error: null,
    success: false,
    createdInvoice: null,
    invoices: [],
  },
  reducers: {
    setCreateInvoiceLoading: (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    },
    setCreateInvoiceSuccess: (state, action) => {
      state.loading = false;
      state.success = true;
      console.log("Create Invoice Success Payload:", action.payload);
      state.createdInvoice = action.payload;
    },
    setCreateInvoiceError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    resetCreateInvoiceState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.createdInvoice = null;
    },
    setInvoiceLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setInvoicesSuccess: (state, action) => {
      state.loading = false;
      state.invoices = action.payload;
    },
    setInvoicesError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setCreateInvoiceLoading,
  setCreateInvoiceSuccess,
  setCreateInvoiceError,
  resetCreateInvoiceState,
  setInvoiceLoading,
  setInvoicesSuccess,
  setInvoicesError,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;
