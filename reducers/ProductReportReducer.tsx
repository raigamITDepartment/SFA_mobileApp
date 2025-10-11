import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ProductSummary = {
  productId: string;
  sku?: string;
  name: string;
  soldQty: number;
  freeQty: number;
  totalBookingValue: number;
  totalSoldValue: number;
  mainCatName?: string;
  subOneCatName?: string;
  subTwoCatName?: string;
  unitOfMeasure?: string;
  discountValue: number;
  goodReturnQty: number;
  marketReturnQty: number;
};

interface ProductReportState {
  products: ProductSummary[];
  loading: boolean;
  error: any | null;
}

const initialState: ProductReportState = {
  products: [],
  loading: false,
  error: null,
};

const productReportSlice = createSlice({
  name: 'productReport',
  initialState,
  reducers: {
    setProductReportLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setProductReportSuccess: (state, action: PayloadAction<ProductSummary[]>) => {
      state.loading = false;
      state.products = action.payload;
    },
    setProductReportError: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetProductReport: () => initialState,
  },
});

export const {
  setProductReportLoading,
  setProductReportSuccess,
  setProductReportError,
  resetProductReport,
} = productReportSlice.actions;

export default productReportSlice.reducer;