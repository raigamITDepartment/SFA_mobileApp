import { combineReducers, AnyAction } from "@reduxjs/toolkit";

import LoginReducer from "./LoginReducer";
import FeRoutReducer from "./FetchRouteReducer";
import FeOutletReducer from "./FetchOutletReducer";
import LogoutReducer, { setLogoutSuccess } from "./LogoutReducer";
import DayStartSlice from "./DayStartReducer";
import OutletSlice from "./OutletReducer";


const appReducer = combineReducers({
  login: LoginReducer,
  fetchRoute: FeRoutReducer,
  fetchOutlet: FeOutletReducer,
  logout: LogoutReducer,
  dayStart: DayStartSlice,
  outlet: OutletSlice,
});

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: AnyAction) => {
  // If the action is a logout, we reset the entire state to its initial values
  if (action.type === setLogoutSuccess.type) {
    // By passing `undefined` to the appReducer, all reducers will be re-initialized.
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export default rootReducer;
