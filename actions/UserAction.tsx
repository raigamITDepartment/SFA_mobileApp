import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { setLoading, setSuccess, setError } from "../reducers/LoginReducer";
import {
  setLogoutLoading,
  setLogoutSuccess,
  setLogoutError,
} from "../reducers/LogoutReducer";
import {
  setDayStartLoading,
  setDayStartSuccess,
  setDayStartError,
} from "../reducers/DayStartReducer";
import { getToken, removeToken } from "../services/AsyncStoreService";
import { userManagementApi } from "../services/Api";


const loginUser = (
  data: any
): ThunkAction<void, RootState, unknown, import("redux").UnknownAction> => {
  return async (dispatch) => {
   // console.log("Login Data:", data);
    // Check if data is valid
    dispatch(setLoading());
    let url = `/api/v1/auth/login`;
   // console.log("Login URL:", url);
    await userManagementApi()
    
      .post(url, data, {
        headers: { "content-type": "application/json; charset=UTF-8" },
      })
      .then((response) => {
       console.log("Login Success Response BY Action:", response.data);
        dispatch(setSuccess(response.data.payload));
      })
      .catch((err) => {
        console.error("Login Error Response:", err.response.data);
        dispatch(setError(err.response.data));
      });
  };
};



// const loginByToken = (
//   data: any
// ): ThunkAction<void, RootState, unknown, AnyAction> => {
//   return async (dispatch, getState) => {
//     dispatch(setLoading());
//     let url = `/api/auth/user/verifyToken`;
//     await userManagementApi()
//       .post(url, data, {
//         headers: { "content-type": "application/json; charset=UTF-8" },
//       })
//       .then((response) => dispatch(setSuccess(response.data.payload)))
//       .catch((err) => dispatch(setError(err.response.data)));
//   };
// };

const logoutUser = (
  data: { userId: number; latitude: number; longitude: number; isCheckIn: boolean , isCheckOut: boolean , gpsStatus: boolean}
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    dispatch(setLogoutLoading());
    console.log("Logout Data:", data);
    try {
      const token = await getToken();

      await userManagementApi().post(
        `/api/v1/auth/dayEnd`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await removeToken();
      dispatch(setLogoutSuccess());
    } catch (error: any) {
      console.error("Logout error:", error.response?.data || error.message);
      dispatch(setLogoutError(error.response?.data || error.message));
    }
  };
};



 const DayStartUser = (
  data: { userId: number; latitude: number; longitude: number; isCheckIn: boolean , isCheckOut: boolean ,gpsStatus: boolean }
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch, getState) => {
    dispatch(setDayStartLoading());
    console.log("Day Start Payload:", data);
    try {
      const token = getState().login.user.data.token;

      if (!token) {
        const errorMessage = "Authentication token not found. Cannot start day.";
        console.error(errorMessage);
        dispatch(setDayStartError({ message: errorMessage }));
        return;
      }

      await userManagementApi().post(`/api/v1/auth/dayStart`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      // The token should not be removed here. It is needed for the entire session.
      dispatch(setDayStartSuccess());
    } catch (error: any) {
      console.error("Day Start error:", error.response?.data || error.message);
      dispatch(setDayStartError(error.response?.data || { message: error.message }));
    }
  };
};













export {
  loginUser,
  logoutUser,
  DayStartUser,
 // loginByEmail,
 // loginByToken,

};
