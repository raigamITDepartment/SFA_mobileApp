import { createSlice } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";

const initialLoginState = {
  user: {
    data: {
      agencyCode: "",
      gpsStatus: false,
      personalName: "",
      role: "",
      roleId: "",
      subRole: "",
      subRoleId: "",
      territoryId: "",
      territoryName: "",
      token: null,
      userAgencyId: "",
      userId: null,
      userName: "",
      userType: null,
      userTypeId: null,
      rangeId: "",
    },
    error: "",
    // loginType: "",
    // isOnboarding: false,
  },
  error: false,
  loading: false,
};

const loginSlice = createSlice({
  name: "login",
  initialState: initialLoginState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
    },
    setSuccess: (state, { payload }) => {
      state.loading = false;
      state.error = false;
      //console.log("Login Success Reducer Payload newwwwwwwwwwww:", payload.data);
      // Decode the JWT token if it exists
      if (payload) {
        if (payload.token) {
          
          //state.user.isOnboarding = payload.isOnboarding || false;
          //console.log("Login Success Reducer Payload isOnboarding:", state.user.isOnboarding);

        //   const content = jwt_decode(payload.token);
        //   console.log("Decoded token content::", content);
   

          state.user.data.agencyCode = payload.agencyCode;
          state.user.data.gpsStatus = payload.gpsStatus;
          state.user.data.personalName = payload.personalName;
          state.user.data.role = payload.role;
          state.user.data.roleId = payload.roleId;

          state.user.data.subRole = payload.subRole;
          state.user.data.subRoleId = payload.subRoleId;
          state.user.data.territoryId = payload.territoryId;
          state.user.data.territoryName = payload.territoryName;
          state.user.data.token = payload.token;
          state.user.data.userAgencyId = payload.userAgencyId;
          state.user.data.userId = payload.userId;
          state.user.data.userName = payload.userName;
          state.user.data.userType = payload.userType;
          state.user.data.userTypeId = payload.userTypeId;
          state.user.data.rangeId = payload.rangeId;

          //console.log("Login Success Reducer User Data:", state.user.data);
          // state.user.loginType = payload.loginType;
        } else {
          state.user.data = {
            agencyCode: "",
            gpsStatus: false,
            personalName: "",
            role: "",
            roleId: "",
            subRole: "",
            subRoleId: "",
            territoryId: "",
            territoryName: "",
            token: null,
            userAgencyId: "",
            userId: null,
            userName: "",
            userType: null,
            userTypeId: null,
            rangeId: "",
          };
         // state.user.isOnboarding = false;
        }

        state.user.error = payload.error;
        //state.user.loginType = payload.loginType;
      }
    },
    setError: (state, { payload }) => {
      //console.error("Login Error Reducer Payload:", payload);
      state.loading = false;
      state.error = true;
      state.user.error = payload; // Store the error object correctly
      state.user.data = initialLoginState.user.data; // Reset user data
    },
  },
});

export const { setLoading, setSuccess, setError } = loginSlice.actions;
export default loginSlice.reducer;
