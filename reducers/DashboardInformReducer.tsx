import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DashboardInfo {
  activeOutletCount: number;
  inactiveOutletCount: number;
  visitedOutletCountForThisMonth: number;
  visitCountForThisMonth: number;
  checkInTime: string;

}

interface DashboardInfoState {
  info: DashboardInfo | null;
  loading: boolean;
  error: any;
}

const initialState: DashboardInfoState = {
  info: null,
  loading: false,
  error: null,
};

const dashboardInfoSlice = createSlice({
  name: "dashboardInfo",
  initialState,
  reducers: {
    setDashboardInfoLoading: (state) => { state.loading = true; state.error = null; },
    setDashboardInfoSuccess: (state, action: PayloadAction<DashboardInfo>) => { state.loading = false; state.info = action.payload; },
    setDashboardInfoError: (state, action: PayloadAction<any>) => { state.loading = false; state.error = action.payload; },
  },
});

export const { setDashboardInfoLoading, setDashboardInfoSuccess, setDashboardInfoError } = dashboardInfoSlice.actions;
export default dashboardInfoSlice.reducer;