import { ThunkAction, UnknownAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  setDashboardInfoLoading,
  setDashboardInfoSuccess,
  setDashboardInfoError,
} from "../reducers/DashboardInformReducer";
import { userManagementApi } from "../services/Api";

export const fetchDashboardInfo = ({
  userId,
  territoryId,
}: {
  userId: number;
  territoryId: number;
}): ThunkAction<void, RootState, unknown, UnknownAction> => {
  return async (dispatch, getState) => {
    dispatch(setDashboardInfoLoading());

    const token = getState().login?.user?.data?.token;
    const url = `/api/v1/reports/dashboardReport/dashboardReportWithRequiredArguments/${territoryId}/${userId}?status=true`;

     console.log("Fetching dashboard info from API with token:", token);
      console.log("Fetching dashboard info from API with URL:", url);
      console.log("Fetching dashboard info from API with userId:", userId);
      console.log("Fetching dashboard info from API with territoryId:", territoryId);
    if (!token) {
      dispatch(setDashboardInfoError({ error: "Unauthorized: Token missing" }));
      return;
    }

    try {
      const response = await userManagementApi().get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Dashboard Info API response:", response.data);

      // ✅ Consistent with invoice report handling
      dispatch(setDashboardInfoSuccess(response.data.payload || []));
    } catch (err) {
      const error = err as { response?: { data?: any }; message?: string };
      console.error(
        "Dashboard Info API error:",
        error.response?.data || error.message
      );

      dispatch(
        setDashboardInfoError(error.response?.data || { error: "Network error" })
      );
    }
  };
};
