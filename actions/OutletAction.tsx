import { ThunkAction, UnknownAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { setRoutesLoading, setRoutesSuccess, setRoutesError } from "../reducers/TeRootReducer";
import { userManagementApi } from "../services/Api";

const fetchRoutesByTerritoryId = (
 territoryId: number
): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async (dispatch, getState) => {
    dispatch(setRoutesLoading());
    const token = getState().login?.user?.data?.token;
    let url = `/api/v1/userDemarcation/route/byTerritoryId/${territoryId}`;
    console.log("Calling API:", url, "with token:", token);
    try {
      const response = await userManagementApi().get(url, { headers: { Authorization: `Bearer ${token}` } });
      console.log("API response:", response.data);
      dispatch(setRoutesSuccess(response.data.payload));
    } catch (err) {
      const error = err as { response?: { data?: any }; message?: string };
      console.error("API error:", error.response?.data || error.message);
      dispatch(setRoutesError(error.response?.data || { error: "Network error" }));
    }
  };
};

export { fetchRoutesByTerritoryId };