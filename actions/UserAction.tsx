import { AnyAction, ThunkAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { setLoading, setSuccess, setError } from "../reducers/LoginReducer";

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


export {
  loginUser,
 // loginByEmail,
 // loginByToken,

};
