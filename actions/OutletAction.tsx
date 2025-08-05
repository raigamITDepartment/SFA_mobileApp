import { ThunkAction, UnknownAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { setRoutesLoading, setRoutesSuccess, setRoutesError } from "../reducers/FetchRouteReducer";
import {
  setCreateOutletLoading,
  setCreateOutletSuccess,
  setCreateOutletError,

 
} from "../reducers/OutletReducer"; // updated import

import { setOutletLoading, setOutletSuccess, setOutletError } from "../reducers/FetchOutletReducer";


import { userManagementApi } from "../services/Api";

const fetchRoutesByTerritoryId = (
 territoryId: number
): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async (dispatch, getState) => {
    dispatch(setRoutesLoading());
    const token = getState().login?.user?.data?.token;
    let url = `/api/v1/userDemarcation/route/byTerritoryId/${territoryId}`;

    try {
      const response = await userManagementApi().get(url, { headers: { Authorization: `Bearer ${token}` } });
    // console.log("API response routes:", response.data);
      dispatch(setRoutesSuccess(response.data.payload));
    } catch (err) {
      const error = err as { response?: { data?: any }; message?: string };
      //console.error("API error:", error.response?.data || error.message);
      dispatch(setRoutesError(error.response?.data || { error: "Network error" }));
    }
  };
};

const fetchRouteIdbyOutlet = (
 RouteId: number
): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async (dispatch, getState) => {
    dispatch(setOutletLoading());
    const token = getState().login?.user?.data?.token;
    let url = `/api/v1/userDemarcation/outlet/getAllOutletsByRouteId/${RouteId}`;

    try {
      const response = await userManagementApi().get(url, { headers: { Authorization: `Bearer ${token}` } });
      //console.log("API response outleteeeeeeeeeeeeeeee: ", response.data.payload);
      dispatch(setOutletSuccess(response.data.payload));
    } catch (err) {
      const error = err as { response?: { data?: any }; message?: string };
      //console.error("API error:", error.response?.data || error.message);
      dispatch(setOutletError(error.response?.data || { error: "Network error" }));
    }
  };
};



 const createOutlet = (
  formData: any
): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async (dispatch, getState) => {
    dispatch(setCreateOutletLoading());
   // console.log("Creating Outlet with data3333333333333:", formData);
    const token = getState().login?.user?.data?.token;
    const url1 = `/api/v1/userDemarcation/outlet`; // Change this to your actual endpoint
  

    try {
      const response = await userManagementApi().post(url1, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
   // console.log("Create Outlet Response11111111111111111:", response);
      // Explicitly check for the success message from the API
      if (response.data && response.data.message === "Success") {
        console.log("Create Outlet Response:", response.data);
        dispatch(setCreateOutletSuccess(response.data.payload));
      } else {
        // Handle cases where the API returns 2xx but indicates an error in the body
        //console.error("Create Outlet API did not return success:", response.data);
        dispatch(setCreateOutletError(response.data || { error: "API returned a non-success message" }));
      }
    } catch (err) {
      const error = err as { response?: { data?: any }; message?: string };
      //console.error("Create Outlet Error:", error.response?.data || error.message);
      dispatch(setCreateOutletError(error.response?.data || { error: "Network error" }));
    }
  };
};
 












export { fetchRoutesByTerritoryId , createOutlet,fetchRouteIdbyOutlet};