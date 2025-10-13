import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * Interface for a single Route object.
 * Based on usage in other files, it must contain at least an 'id'.
 */
interface Route {
  id: number;
  [key: string]: any; // Allows for other properties from the API
}

/**
 * Interface for the Routes state in Redux.
 */
interface RoutesState {
  loading: boolean;
  Routes: Route[];
  error: any | null;
}

const initialState: RoutesState = {
  loading: false,
  Routes: [],
  error: null,
};

const fetchRouteSlice = createSlice({
  name: "routes", // This name will be used as the key in the root reducer
  initialState,
  reducers: {
    setRoutesLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setRoutesSuccess: (state, action: PayloadAction<Route[]>) => {
      state.loading = false;
      state.Routes = action.payload;
    },
    setRoutesError: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setRoutesLoading, setRoutesSuccess, setRoutesError } = fetchRouteSlice.actions;

export default fetchRouteSlice.reducer;
