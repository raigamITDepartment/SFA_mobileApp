import { ThunkAction, UnknownAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { fetchRoutesByTerritoryId, fetchRouteIdbyOutlet } from "./OutletAction";
import { setRoutesSuccess } from "../reducers/FetchRouteReducer";
import { fetchItems, fetchItemIdbyPrice } from "./InvoiceAction";

/**
 * Fetches all initial data required for the app to work offline.
 * This should be dispatched after a successful login.
 */
export const fetchAndCacheInitialData = (): ThunkAction<
  Promise<void>,
  RootState,
  unknown,
  UnknownAction
> => {
  return async (dispatch, getState): Promise<void> => {
    console.log("Starting to fetch and cache initial data...");
    const user = getState().login.user;
    const territoryId = user?.data?.territoryId;

    if (!territoryId) {
      console.error("Cannot fetch initial data: territoryId is missing.");
      return;
      return Promise.reject("Territory ID is missing");
    }

    try {
      // 1. Fetch and cache routes
      // The thunk now returns the data directly.
      const routes: any[] = await dispatch(fetchRoutesByTerritoryId(Number(territoryId)));

      // 2. For each route, fetch and cache outlets
      if (routes && routes.length > 0) {
        console.log(`Fetching outlets for ${routes.length} routes.`);
        // Use Promise.all to fetch outlets for all routes concurrently
        await Promise.all(
          routes.map(route => dispatch(fetchRouteIdbyOutlet(route.id)))
        );
      }

      // 3. Fetch and cache items
      // The thunk now returns the items directly.
      const items: any[] = await dispatch(fetchItems(Number(territoryId)));

      // 4. For each item, fetch and cache prices
      if (items && items.length > 0) {
        console.log(`Fetching prices for ${items.length} items.`);
        // Use Promise.all to fetch prices for all items concurrently
        await Promise.all(
          items.map(item => dispatch(fetchItemIdbyPrice(item.itemId, Number(territoryId))))
        );
      }

      console.log("Finished fetching and caching initial data.");
      return Promise.resolve();
    } catch (error) {
      console.error("An error occurred during initial data fetch and cache:", error);
      return Promise.reject(error);
    }
  };
};
