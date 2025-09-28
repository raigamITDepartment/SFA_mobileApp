import { ThunkAction, UnknownAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import {
  setUnproductiveCallLoading,
  setUnproductiveCallSuccess,
  setUnproductiveCallError,
} from '../reducers/UnproductiveCallReducer';
import { userManagementApi } from '../services/Api';

type UnproductiveCallData = {
  userId: number;
  territoryId: number;
  routeId: number;
  outletId: number;
  latitude: number;
  longitude: number;
  reasonId: number;
  reason: string;
  isActive: boolean;
};

export const submitUnproductiveCall = (
  data: UnproductiveCallData
): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async (dispatch, getState) => {
    dispatch(setUnproductiveCallLoading());
    const token = getState().login?.user?.data?.token;
    // NOTE: Please verify this is the correct endpoint for unproductive calls.
    const url = `/api/v1/sales/invoice/saveUnproductiveCall`;

    try {
      const response = await userManagementApi().post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
       console.log("Unproductive Call Response:", response.data);
      if (response.data && response.data.message === 'Success') {
        dispatch(setUnproductiveCallSuccess(response.data.payload));
      } else {
        dispatch(setUnproductiveCallError(response.data || { error: 'API returned a non-success message' }));
      }
    } catch (err) {
      const error = err as { response?: { data?: any }; message?: string };
      console.error("Unproductive Call Error:", error.response?.data || error.message);
      dispatch(setUnproductiveCallError(error.response?.data || { error: 'Network error' }));
    }
  };
};