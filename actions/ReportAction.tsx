import { ThunkAction, UnknownAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import {
  setInvoiceReportLoading,
  setInvoiceReportSuccess,
  setInvoiceReportError,
} from '../reducers/InvoiceReportReducer';
import {
  setLastInvoicesLoading,
  setLastInvoicesSuccess,
  setLastInvoicesError,
} from '../reducers/LastThreeInvoicesReducer';
import {
  setInvoiceDetailsLoading,
  setInvoiceDetailsSuccess,
  setInvoiceDetailsError,
} from '../reducers/InvoiceDetailsReducer';
import {
  setProductReportLoading,
  setProductReportSuccess,
  setProductReportError,
} from '../reducers/ProductReportReducer'; // Assuming this reducer exists or will be created
import { userManagementApi } from '../services/Api';

type FetchParams = {
  territoryId: number;
  startDate: string;
  endDate: string;
};

export const fetchInvoiceSummaryReport = ({
  territoryId,
  startDate,
  endDate,
}: FetchParams): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async (dispatch, getState) => {
    dispatch(setInvoiceReportLoading());
    const token = getState().login?.user?.data?.token;
    const url = `/api/v1/reports/invoiceReport/getAllActiveInvoicesForMobile?territoryId=${territoryId}&startDate=${startDate}&endDate=${endDate}`;

    try {
      const response = await userManagementApi().get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Invoice Report API response:', response.data);

      dispatch(setInvoiceReportSuccess(response.data.payload || [])); // Dispatch the payload array
    } catch (err) {
      const error = err as { response?: { data?: any }; message?: string };
      console.error('Invoice Report API error:', error.response?.data || error.message);
      dispatch(setInvoiceReportError(error.response?.data || { error: 'Network error' }));
    }
  };
};

export const fetchProductSummaryReport = ({
  territoryId,
  startDate,
  endDate,
}: FetchParams): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async (dispatch, getState) => {
    dispatch(setProductReportLoading());
    const token = getState().login?.user?.data?.token;
    const url = `/api/v1/reports/itemReport/territoryWiseItemSummeryByRequiredArgs?territoryId=${territoryId}&startDate=${startDate}&endDate=${endDate}`;

    try {
      const response = await userManagementApi().get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Product Summary Report API response:', response.data);

      // The API payload seems to have a different structure.
      // We need to map it to the `ProductSummary` type used in the component.
      const mappedData = response.data.payload.map((item: any) => ({
        productId: item.itemId, // Correct
        name: item.itemName, // Correct
        soldQty: item.totalBookingQty, // Use totalBookingQty for sold quantity
        freeQty: item.totalFreeQty, // Correct
        goodReturnQty: item.totalGoodReturnQty, // Correct
        marketReturnQty: item.totalMarketReturnQty, // Correct
        discountValue: item.totalDiscountValue, // Correct
        sku: item.itemSapCode, // Use itemSapCode for SKU
        totalBookingValue: item.totalBookingValue,
        totalSoldValue: item.totalSoldValue,
        mainCatName: item.mainCatName,
        subOneCatName: item.subOneCatName,
        subTwoCatName: item.subTwoCatName,
        unitOfMeasure: item.unitOfMeasure,
      }));

      dispatch(setProductReportSuccess(mappedData || []));
    } catch (err) {
      const error = err as { response?: { data?: any }; message?: string };
      console.error('Product Summary Report API error:', error.response?.data || error.message);
      dispatch(setProductReportError(error.response?.data || { error: 'Network error' }));
    }
  };
};

export const fetchInvoiceDetailsById = (
  invoiceId: number
): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async (dispatch, getState) => {
    dispatch(setInvoiceDetailsLoading());
    const token = getState().login?.user?.data?.token;
    const url = `/api/v1/reports/invoiceReport/findInvoiceWithDetailsByInvoiceId/${invoiceId}`;

    try {
      const response = await userManagementApi().get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Invoice Details API response:', response.data);

      if (response.data && response.data.payload) {
        dispatch(setInvoiceDetailsSuccess(response.data.payload));
      }
    } catch (err) {
      const error = err as { response?: { data?: any }; message?: string };
      dispatch(setInvoiceDetailsError(error.response?.data || { error: 'Network error' }));
    }
  };
};

export const fetchLastThreeInvoices = (
  outletId: number
): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async (dispatch, getState) => {
    dispatch(setLastInvoicesLoading());
    const token = getState().login?.user?.data?.token;
    const url = `/api/v1/reports/invoiceReport/getLastThreeInvoicesByOutletId/${outletId}`;

    try {
      const response = await userManagementApi().get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Last 3 Invoices API response:', response.data);

      dispatch(setLastInvoicesSuccess(response.data.payload || []));
    } catch (err) {
      const error = err as { response?: { data?: any }; message?: string };
      console.error('Last 3 Invoices API error:', error.response?.data || error.message);
      dispatch(setLastInvoicesError(error.response?.data || { error: 'Network error' }));
    }
  };
};