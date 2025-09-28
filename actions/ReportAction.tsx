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