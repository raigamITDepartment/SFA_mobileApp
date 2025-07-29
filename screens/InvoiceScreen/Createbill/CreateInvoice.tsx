import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../store/Hooks";
import { fetchRoutesByTerritoryId, fetchRouteIdbyOutlet } from "../../../actions/OutletAction";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import SearchableDropdown from "../../../components/ui/CustomerDropdown";

type RootStackParamList = {
  Home: undefined;
  CreateInvoice:
    | { customerId?: string; invoiceType?: string; invoiceMode?: string }
    | undefined;
  CreateInvoiceScreen: {
    customerId: string;
    customerName: string;
    invoiceType: string;
    invoiceMode: string;
  };
  ViewLastBillScreen: {
    customerId: string;
    customerName: string;
    invoiceType: string;
    invoiceMode: string;
  };
  UpproductiveCall: undefined;
};

type CreateInvoiceProps = NativeStackScreenProps<RootStackParamList, "CreateInvoice">;

const CreateInvoice = ({ navigation, route }: CreateInvoiceProps): React.JSX.Element => {
  const dispatch: any = useAppDispatch();
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [invoiceType, setInvoiceType] = useState<string>("");
  const [invoiceMode, setInvoiceMode] = useState<string>("1"); // Default to 'Booking'
  const [date] = useState(new Date());

  const territoryId = useSelector((state: any) => state.login?.user?.data?.territoryId);
  const { routes, loading: routesLoading } = useAppSelector((state) => state.fetchRoute);
  const { outlets, loading: outletsLoading } = useAppSelector((state) => state.fetchOutlet);

  useEffect(() => {
    if (territoryId) {
      dispatch(fetchRoutesByTerritoryId(territoryId));
    }
  }, [territoryId, dispatch]);

  useEffect(() => {
    if (route.params) {
      if (route.params.customerId) setSelectedCustomer(route.params.customerId);
      if (route.params.invoiceType) setInvoiceType(route.params.invoiceType);
      if (route.params.invoiceMode) setInvoiceMode(route.params.invoiceMode);
    }
  }, [route.params]);

  const handleRouteChanged = (routeId: string) => {
    setSelectedRoute(routeId);
    setSelectedCustomer("");
    if (routeId) {
      dispatch(fetchRouteIdbyOutlet(Number(routeId)));
    }
  };

  const handleCreateInvoice = () => {
    if (!selectedCustomer || !invoiceType || !invoiceMode) {
      Alert.alert("Can't Create the Bill", "Please select all fields before proceeding.");
      return;
    }

    const customer = outlets.find((c: any) => String(c.id) === selectedCustomer);
    if (customer) {
      navigation.navigate("ViewLastBillScreen", {
        customerId: String(customer.id),
        customerName: customer.outletName,
        invoiceType,
        invoiceMode,
      });
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
          selectedValue={selectedRoute}
          setSelectedValue={handleRouteChanged}
          options={(routes || []).map((r: any) => ({ id: r.id, name: r.routeName }))}
          loading={routesLoading}
        />

        <SearchableDropdown
          label="Customer"
          selectedValue={selectedCustomer}
          setSelectedValue={setSelectedCustomer}
          options={(outlets || [])
            .filter((c: any) => selectedRoute === "" || String(c.routeId) === selectedRoute)
            .map((c: any) => ({ id: c.id, name: c.outletName }))}
          loading={outletsLoading}
        />

        <SearchableDropdown
          label="Invoice Type"
          selectedValue={invoiceType}
          setSelectedValue={setInvoiceType}
          options={[
            { id: "Normal", name: "Normal Invoice" },
            { id: "Agency", name: "Agency Direct Invoice" },
            { id: "Company", name: "Company Direct Invoice" },
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
            onPress={() => navigation.navigate("UpproductiveCall")}
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

export default CreateInvoice;
