import { ThunkAction, UnknownAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { setItemsLoading, setItemsSuccess, setItemsError } from "../reducers/FetchItemsReducer";
import { setPriceLoading, setPriceSuccess, setPriceError } from "../reducers/FetchPriceReducer"; 
import { setCreateInvoiceLoading, setCreateInvoiceSuccess, setCreateInvoiceError, resetCreateInvoiceState } from "../reducers/CreateInvoiceReducer";

import { userManagementApi } from "../services/Api";



const fetchItems = (
territoryId: number
): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async (dispatch, getState) => {
    dispatch(setItemsLoading());
    const token = getState().login?.user?.data?.token;
    let url = `/api/v1/sales/item//grouped-by-main-category-list/${territoryId}`;
    console.log("Fetching items from API with token:", token);
    console.log("Fetching items from API with URL:", url);

    try {
      const response = await userManagementApi().get(url, { headers: { Authorization: `Bearer ${token}` } });
      // The API returns the data array directly, not nested under a 'payload' key.
      console.log("API response for items: ", response.data);
      dispatch(setItemsSuccess(response.data));
    } catch (err) {
      const error = err as { response?: { data?: any }; message?: string };
      //console.error("API error:", error.response?.data || error.message);
      dispatch(setItemsError(error.response?.data || { error: "Network error" }));
    }
  };
};



const fetchItemIdbyPrice = (
  itemId: number,
  rangeId: number
): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async (dispatch, getState) => {
    dispatch(setPriceLoading());
    const token = getState().login?.user?.data?.token;

    if (!token) {
      dispatch(setPriceError({ error: "Unauthorized: Token missing" }));
      return;
    }

    const url = `/api/v1/sales/itemPrice/findItemPricesByTerritoryAndItemIds/${itemId}/${rangeId}`;

    try {
      const response = await userManagementApi().get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(setPriceSuccess(response.data.payload));
    } catch (err) {
      const error = err as { response?: { data?: any }; message?: string };
      dispatch(setPriceError(error.response?.data || { error: "Network error" }));
    }
  };
};


 const createInvoice = (
  invoiceData: any,
): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async (dispatch, getState) => {
    dispatch(setCreateInvoiceLoading());
    console.log("Creating Invoice with data:", invoiceData);
    const token = getState().login?.user?.data?.token;
    const url = `/api/v1/sales/invoice`;
  

    try {
      const response = await userManagementApi().post(url, invoiceData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      // Explicitly check for the success message from the API
      if (response.data && response.data.message === "Success") {
      //  console.log("Create invoice Response:", response.data);
        dispatch(setCreateInvoiceSuccess(response.data.payload));
      } else {
        // Handle cases where the API returns 2xx but indicates an error in the body
        console.error("Create invoice API did not return success:", response.data);
        dispatch(setCreateInvoiceError(response.data || { error: "API returned a non-success message" }));
      }
    } catch (err) {
      const error = err as { response?: { data?: any }; message?: string };
      console.error("Create invoice Error:", error.response?.data || error.message);
      dispatch(setCreateInvoiceError(error.response?.data || { error: "Network error" }));
    }
  };
};
 
















export { fetchItems,fetchItemIdbyPrice,createInvoice, resetCreateInvoiceState};