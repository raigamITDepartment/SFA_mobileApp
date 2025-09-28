import { combineReducers, AnyAction } from "@reduxjs/toolkit";

import LoginReducer from "./LoginReducer";
import FeRoutReducer from "./FetchRouteReducer";
import fetchOutletReducer from "./FetchOutletReducer";
import LogoutReducer, { setLogoutSuccess } from "./LogoutReducer";
import DayStartSlice from "./DayStartReducer";
import OutletSlice from "./OutletReducer";
import ItemSlice from "./FetchItemsReducer";
import PriceSlice from "./FetchPriceReducer"
import InvoiceSlice from "./CreateInvoiceReducer";
import UnproductiveCallReducer from "./UnproductiveCallReducer";
import InvoiceReportReducer from "./InvoiceReportReducer"; 
import DashboardInformReducer from "./DashboardInformReducer";
import LastThreeInvoicesReducer from "./LastThreeInvoicesReducer";
import InvoiceDetailReducer from "./InvoiceDetailsReducer";




const appReducer = combineReducers({
  login: LoginReducer,
  fetchRoute: FeRoutReducer,
  fetchOutlet: fetchOutletReducer,
  logout: LogoutReducer,
  dayStart: DayStartSlice,
  outlet: OutletSlice,
  Items: ItemSlice,
  Price: PriceSlice,
  Invoice: InvoiceSlice,
  unproductiveCall: UnproductiveCallReducer,
  invoiceReport: InvoiceReportReducer,
  dashboardInfo: DashboardInformReducer,
  lastThreeInvoices: LastThreeInvoicesReducer,
  invoiceDetails: InvoiceDetailReducer,
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
