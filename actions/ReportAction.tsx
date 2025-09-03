import { ThunkAction, UnknownAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import {
  setInvoiceReportLoading,
  setInvoiceReportSuccess,
  setInvoiceReportError,
} from '../reducers/InvoiceReportReducer';
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
    const url = `/api/v1/reports/invoiceStatusReport/getAllActiveInvoicesForMobile?territoryId=${territoryId}&startDate=${startDate}&endDate=${endDate}`;

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