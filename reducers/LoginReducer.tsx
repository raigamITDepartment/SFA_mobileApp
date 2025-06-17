import { createSlice } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";

const initialLoginState = {
    user: {
        data: {
            id: "",
            userName: "",
            firstName: "",
            lastName: "",
            email: "",
            mobileNumber: "",
            token: "",
       
         
            role: "",
            roleId: null,
            subRole: "",
            subRoleId: null,
            userType: "",
            userTypeId: null,
            territoryId: null,
            userAgencyId: null,
            agencyCode: null,
            gpsStatus: false,
        },
        error: "",
        loginType: "",
        isOnboarding: false,
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

            const res = payload?.payload;
            if (res && res.token) {
             // If you need to decode the token, you can use:
             // const content = jwt_decode(res.token);

                state.user.data.id = res.userId?.toString() ?? "";
                state.user.data.userName = res.userName ?? "";
                state.user.data.firstName = res.personalName?.split(" ")[0] ?? "";
                state.user.data.lastName = res.personalName?.split(" ")[1] ?? "";
                state.user.data.token = res.token;
                state.user.data.gpsStatus = res.gpsStatus ?? false;

 
     

                // Additional fields from your API
                state.user.data.role = res.role;
                state.user.data.roleId = res.roleId;
                state.user.data.subRole = res.subRole;
                state.user.data.subRoleId = res.subRoleId;
                state.user.data.userType = res.userType;
                state.user.data.userTypeId = res.userTypeId;
                state.user.data.territoryId = res.territoryId;
                state.user.data.userAgencyId = res.userAgencyId;
                state.user.data.agencyCode = res.agencyCode;
              

                state.user.error = payload.error ?? "";
                state.user.loginType = payload.loginType ?? "";
            }
        },
        setError: (state, { payload }) => {
            state.error = true;
            state.user = payload;
        },
    },
});

// export the actions
export const { setLoading, setSuccess, setError } = loginSlice.actions;

// export the default reducer
export default loginSlice.reducer;
