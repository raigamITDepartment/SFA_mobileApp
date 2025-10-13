import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAppDispatch, useAppSelector, RootState } from "../../../store/Hooks";
import { fetchRoutesByTerritoryId, fetchRouteIdbyOutlet } from "../../../actions/OutletAction";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { setOutletSuccess } from "../../../reducers/FetchOutletReducer";
import { setRoutesSuccess } from "../../../reducers/FetchRouteReducer";
import * as Location from "expo-location";
import SearchableDropdown from "../../../components/ui/CustomerDropdown";
import UnproductiveCallDialog from "./UnproductiveCallDialog";
//import { submitUnproductiveCall } from "../../../actions/UnproductiveCallAction";
import { resetUnproductiveCallState } from "../../../reducers/UnproductiveCallReducer";

type RootStackParamList = {
  Home: undefined;
  CreateInvoice:
    | { routeId?: string; customerId?: string; invoiceType?: string; invoiceMode?: string }
    | undefined;
  CreateInvoiceScreen: {
    routeId: string;
    customerId: string;
    customerName: string;
    invoiceType: string;
    invoiceMode: string;
  };
  ViewLastBillScreen: {
    routeId: string;
    customerId: string;
    customerName: string;
    invoiceType: string;
    invoiceMode: string;
  };
};

interface RouteType {
  id: number;
  routeName: string;
  // Add other properties as necessary
}

interface OutletType {
  id: number;
  outletName: string;
  // Add other properties as necessary
}

// Define stable empty objects to use as default values in selectors
const defaultRoutesState = { Routes: [], loading: false, error: null };
const defaultOutletsState = { Outlets: [], loading: false, error: null };



type CreateInvoiceProps = NativeStackScreenProps<RootStackParamList, "CreateInvoice">;

const CreateInvoiceScreen = ({ navigation, route }: CreateInvoiceProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const [storedRoutes, setStoredRoutes] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  console.log("selectedCustomer", storedRoutes);
  const [invoiceType, setInvoiceType] = useState<string>("");
  const [invoiceMode, setInvoiceMode] = useState<string>("");
  const [date] = useState(new Date());
  const [isUnproductiveCallDialogVisible, setIsUnproductiveCallDialogVisible] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // Correctly select data from the Redux store.
  // The state slice is 'routes', and the array within it is 'Routes'.
  // We alias 'Routes' to 'routes' for use in the component.

  const { Routes: routes = [], loading: routesLoading } = useAppSelector((state) => state.fetchRoute || defaultRoutesState);
  const { outlets = [], loading: outletsLoading } = useAppSelector((state) => state.fetchOutlet || defaultOutletsState);


  const user = useAppSelector((state: RootState) => state.login.user);
  const territoryId = user?.data?.territoryId;
  const userId = user?.data?.userId;

    const rangeId = useAppSelector((state: RootState) => state.login.user?.data?.range);
    console.log("rangeId", rangeId);

  const {
    loading: unproductiveLoading,
    success: unproductiveSuccess,
    error: unproductiveError,
  } = useAppSelector((state: RootState) => state.unproductiveCall);

  useEffect(() => {
    if (rangeId) {
      if (["B", "R"].includes(rangeId)) {
        setInvoiceMode("2"); // Actual
      } else {
        setInvoiceMode("1"); // Booking
      }
    }
  }, [rangeId]);

  useEffect(() => {
    const loadRoutes = async () => {
      if (territoryId) {
        try {
          const routesFromStorage = await AsyncStorage.getItem(`@routes_${territoryId}`);
          if (routesFromStorage) {
            console.log("Loading routes from AsyncStorage for dropdown.", routesFromStorage);
            dispatch(setRoutesSuccess(JSON.parse(routesFromStorage)));
          } else {
            console.log("No routes in AsyncStorage, fetching from API.");
            dispatch(fetchRoutesByTerritoryId(territoryId));
          }
        } catch (e) {
          console.error("Failed to load routes from AsyncStorage, fetching from API.", e);
          dispatch(fetchRoutesByTerritoryId(territoryId));
        }
      }
    }
    loadRoutes();

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Permission to access location was denied."
        );
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
      } catch (error) {
        console.error("Failed to get location", error);
        Alert.alert("Location Error", "Could not fetch location.");
      }
    })();
  }, [territoryId, dispatch]);

  useFocusEffect(
    useCallback(() => {
      if (unproductiveSuccess) {
        Alert.alert("Success", "Unproductive call saved.", [
          { text: "OK", onPress: () => {
              dispatch(resetUnproductiveCallState());
              navigation.navigate("Home");
            }
          },
        ]);
      }
      if (unproductiveError) {
        Alert.alert(
          "Error",
          unproductiveError.message || "Failed to save unproductive call.",
          [
            {
              text: "OK",
              onPress: () => dispatch(resetUnproductiveCallState()),
            },
          ]
        );
      }
    }, [unproductiveSuccess, unproductiveError, dispatch, navigation])
  );

  useEffect(() => {
    // Safely access route params with default values to prevent crashes
    const {
      routeId = "",
      customerId = "",
      invoiceType: paramInvoiceType = "",
      invoiceMode: paramInvoiceMode = "",
    } = route.params || {};
    setStoredRoutes(routeId);
    setSelectedCustomer(customerId);
    setInvoiceType(paramInvoiceType);
    setInvoiceMode(paramInvoiceMode);
  }, [route.params]);

  const handleRouteChanged = async (routeId: string) => {
    setStoredRoutes(routeId);
    setSelectedCustomer("");
    if (routeId) {
      try {
        const storedOutlets = await AsyncStorage.getItem(`@outlets_for_route_${routeId}`);
        if (storedOutlets) {
          console.log(`Loading outlets for route ${routeId} from AsyncStorage.`);
          dispatch(setOutletSuccess(JSON.parse(storedOutlets)));
        } else {
          console.log(`No outlets for route ${routeId} in AsyncStorage, fetching from API.`);
          dispatch(fetchRouteIdbyOutlet(Number(routeId)));
        }
      } catch (e) {
        console.error(`Failed to load outlets for route ${routeId} from AsyncStorage, fetching from API.`, e);
        dispatch(fetchRouteIdbyOutlet(Number(routeId)));
      }
    }
  };

  const handleUnproductiveCall = () => {
    if (!storedRoutes || !selectedCustomer) {
      Alert.alert("Selection Required", "Please select a route and a customer first.");
      return;
    }
    setIsUnproductiveCallDialogVisible(true);
  };

  const handleUnproductiveSubmit = (reason: { id: number; reason: string }) => {
    if (userId && territoryId && storedRoutes && selectedCustomer && latitude && longitude) {
      dispatch(
        submitUnproductiveCall({
          userId: Number(userId),
          territoryId: Number(territoryId),
          routeId: Number(storedRoutes),
          outletId: Number(selectedCustomer),
          reasonId: reason.id,
          reason: reason.reason,
          latitude,
          longitude,
          isActive: true,
        })
      );
    }
    setIsUnproductiveCallDialogVisible(false);
  };

  const handleCreateInvoice = async (): Promise<void> => {
    if (!selectedCustomer || !invoiceType || !invoiceMode) {
      Alert.alert("Can't Create the Bill", "Please select all fields before proceeding.");
      return;
    }

    const customer = outlets.find((c: any) => String(c.id) === selectedCustomer);
    if (customer) {
      const selectedRouteObject = routes.find((r: RouteType) => String(r.id) === storedRoutes);
      const routeName = selectedRouteObject ? selectedRouteObject.routeName : '';
      try {
        // Clear previous invoice draft data from AsyncStorage
        const keys = await AsyncStorage.getAllKeys();
        const invoiceKeys = keys.filter(
          (key) => key.startsWith("item_") || key.startsWith("lastBill_") || ["RouteName", "customerName", "invoiceType", "invoiceMode"].includes(key)
        );
        await AsyncStorage.multiRemove(invoiceKeys);

        // Save invoice details to AsyncStorage
        await AsyncStorage.setItem('RouteName', routeName);
        await AsyncStorage.setItem('customerName', customer.outletName);
        await AsyncStorage.setItem('invoiceType', invoiceType);
        await AsyncStorage.setItem('invoiceMode', invoiceMode);

        // Navigate to the next screen, passing the data as params for immediate use
        navigation.navigate("ViewLastBillScreen", {
          routeId: storedRoutes,
          customerId: String(customer.id),
          customerName: customer.outletName,
          invoiceType,
          invoiceMode,
        });
      } catch (e) {
        console.error("Failed to save data to AsyncStorage", e);
        Alert.alert("Error", "Failed to save invoice details. Please try again.");
      }
    } else {
      Alert.alert("Error", "Customer not found");
    }
  };

  return (
    <LinearGradient colors={["#ff6666", "#ff0000"]} style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back-outline" size={28} color="white" onPress={() => navigation.navigate("Home")} />
        <Text style={styles.title}>Raigam SFA Invoice</Text>
        <Ionicons name="notifications-outline" size={28} color="white" />
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Date / Time</Text>
          <Text style={styles.dateText}>
            {date.toLocaleDateString()}{" "}
            {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </View>

        <SearchableDropdown
          label="Route"
          selectedValue={storedRoutes}
          setSelectedValue={handleRouteChanged}
          options={routes.map((r: any) => ({ id: r.id, name: r.routeName }))}
          loading={routesLoading}
        />

        <SearchableDropdown
          label="Customer"
          selectedValue={selectedCustomer}
          setSelectedValue={setSelectedCustomer}
          options={outlets.map((c: any) => ({ id: c.id, name: c.outletName }))}
          loading={outletsLoading}
          disabled={!storedRoutes || outletsLoading}

        />

        <SearchableDropdown
          label="Invoice Type"
          selectedValue={invoiceType}
          setSelectedValue={setInvoiceType}
          options={[
            { id: "NORMAL", name: "Normal Invoice" },
            { id: "AGENCY", name: "Agency Direct Invoice" },
            { id: "COMPANY", name: "Company Direct Invoice" },
          ]}
        />

        <SearchableDropdown
          label="Invoice Mode"
          selectedValue={invoiceMode}
          setSelectedValue={setInvoiceMode}
          options={[
            { id: "1", name: "Booking" },
            { id: "2", name: "Actual" },
          ]}
        />

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.unproductiveButton]}
            onPress={handleUnproductiveCall}
          >
            <Text style={styles.buttonText}>Unproductive Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.createButton]}
            onPress={handleCreateInvoice}
          >
            <Text style={styles.buttonText}>Create Invoice</Text>
          </TouchableOpacity>
        </View>
      </View>
      <UnproductiveCallDialog
        visible={isUnproductiveCallDialogVisible}
        onDismiss={() => setIsUnproductiveCallDialogVisible(false)}
        onSubmit={handleUnproductiveSubmit}
        loading={unproductiveLoading}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  form: {
    backgroundColor: "#ffe6e6",
    borderRadius: 10,
    padding: 20,
    marginTop: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  field: {
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    color: "#555",
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  unproductiveButton: {
    backgroundColor: "#f57c00",
  },
  createButton: {
    backgroundColor: "#4caf50",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CreateInvoiceScreen;
