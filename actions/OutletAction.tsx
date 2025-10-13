import { ThunkAction, UnknownAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { setRoutesLoading, setRoutesSuccess, setRoutesError } from "../reducers/FetchRouteReducer";
import {
  setCreateOutletLoading,
  setCreateOutletSuccess,
  setCreateOutletError,
  setUpdateOutletLoading,
  setUpdateOutletSuccess,
  setUpdateOutletError,
 
} from "../reducers/OutletReducer"; // updated import

import { setOutletLoading, setOutletSuccess, setOutletError } from "../reducers/FetchOutletReducer";
import {
  setOutletDetailsLoading,
  setOutletDetailsSuccess,
  setOutletDetailsError,
} from "../reducers/FetchOutletDetailsReducer";


import { userManagementApi } from "../services/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const fetchRoutesByTerritoryId = (
  territoryId: number
): ThunkAction<Promise<any>, RootState, unknown, UnknownAction> => {
  return async (dispatch, getState) => {
    dispatch(setRoutesLoading());
    const token = getState().login?.user?.data?.token;
    let url = `/api/v1/userDemarcation/route/byTerritoryId/${territoryId}`;

    try {
      const response = await userManagementApi().get(url, { headers: { Authorization: `Bearer ${token}` } });
    console.log("API response routes:", response.data);
      // Store routes in AsyncStorage
      await AsyncStorage.setItem(`@routes_${territoryId}`, JSON.stringify(response.data.payload));
      console.log(`Routes for territory ${territoryId} stored in AsyncStorage.`);

      dispatch(setRoutesSuccess(response.data.payload));
      return response.data.payload; // Return the data on success
    } catch (err) {
      const error = err as { response?: { data?: any }; message?: string };
      //console.error("API error:", error.response?.data || error.message);
      dispatch(setRoutesError(error.response?.data || { error: "Network error" }));
      return Promise.reject(error); // Reject the promise on error
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
      console.log("API response outleteeeeeeeeeeeeeeee: ", response.data.payload);
      // Store outlets in AsyncStorage
      await AsyncStorage.setItem(`@outlets_for_route_${RouteId}`, JSON.stringify(response.data.payload));
      console.log(`Outlets for route ${RouteId} stored in AsyncStorage.`);

      dispatch(setOutletSuccess(response.data.payload));
    } catch (err) {
      const error = err as { response?: { data?: any }; message?: string };
      //console.error("API error:", error.response?.data || error.message);
      dispatch(setOutletError(error.response?.data || { error: "Network error" }));
    }
  };
};

const fetchOutletById = (
  outletId: number
): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async (dispatch, getState) => {
    dispatch(setOutletDetailsLoading());
    const token = getState().login?.user?.data?.token;
    const url = `/api/v1/userDemarcation/outlet/findById/${outletId}`;

    try {
      const response = await userManagementApi().get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API response for outlet details: ", response.data.payload);
      dispatch(setOutletDetailsSuccess(response.data.payload));
    } catch (err) {
      const error = err as { response?: { data?: any }; message?: string };
      dispatch(setOutletDetailsError(error.response?.data || { error: "Network error" }));
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
 
 const updateOutlet = (
  formData: any
): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async (dispatch, getState) => {
    dispatch(setUpdateOutletLoading());
    console.log("Updating Outlet with data:", formData);
    const token = getState().login?.user?.data?.token;
    const url = `/api/v1/userDemarcation/outlet`;
  

    try {
      const response = await userManagementApi().put(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      // Explicitly check for the success message from the API
      if (response.data && response.data.message === "Success") {
        console.log("Update  Outlet Response:", response.data);
        dispatch(setUpdateOutletSuccess(response.data.payload));
      } else {
        // Handle cases where the API returns 2xx but indicates an error in the body
        console.error("Update Outlet API did not return success:", response.data);
        dispatch(setUpdateOutletError(response.data || { error: "API returned a non-success message" }));
      }
    } catch (err) {
      const error = err as { response?: { data?: any }; message?: string };
      console.error("Update Outlet Error:", error.response?.data || error.message);
      dispatch(setUpdateOutletError(error.response?.data || { error: "Network error" }));
    }
  };
};











export { fetchRoutesByTerritoryId, createOutlet, fetchRouteIdbyOutlet, fetchOutletById,updateOutlet };