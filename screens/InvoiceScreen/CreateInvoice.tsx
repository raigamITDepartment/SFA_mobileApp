import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Picker } from "@react-native-picker/picker";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
//import { RootStackParamList } from '@/navigation/AuthNavigator';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAppDispatch, useAppSelector } from "../../store/Hooks";
import type { AppDispatch } from "../../store"; // adjust the path as needed
import { fetchRoutesByTerritoryId } from "../../actions/OutletAction";

type RootStackParamList = {
  HomeScreen: undefined;
  CreateInvoice: { customerId?: string; invoiceType?: string; invoiceMode?: string } | undefined;
  // This should be defined in your main navigator's param list (e.g., AuthNavigator.tsx)
  CreateInvoiceScreen: { customerId: string; customerName: string; invoiceType: string; invoiceMode: string };
};

type CreateInvoiceProps = NativeStackScreenProps<
  RootStackParamList,
  "CreateInvoice"
>;

const customers = [
  { id: 'customerA', name: 'Pathirana Super City' },
  { id: 'customerB', name: 'Customer B' },
    { id: 'customerC', name: 'Super K' },
];

const CreateInvoice = ({
  navigation,
  route,
}: CreateInvoiceProps): React.JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const [selectedRoute, setSelectedRoute] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [invoiceType, setInvoiceType] = useState<string>("");
  const [invoiceMode, setInvoiceMode] = useState<string>("");
  const territoryId = useSelector(
    (state: any) => state.login?.user?.data?.territoryId
  );
  const Route = useAppSelector((state) => state.root);
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    if (
      territoryId !== undefined &&
      territoryId !== null &&
      territoryId !== ""
    ) {
      dispatch(fetchRoutesByTerritoryId(territoryId));
      console.log("Fetching routes for territoryId:", territoryId);
    }
  }, [territoryId, dispatch]);

  useEffect(() => {
    if (route.params) {
      if (route.params.customerId) {
        setSelectedCustomer(route.params.customerId);
      }
      if (route.params.invoiceType) {
        setInvoiceType(route.params.invoiceType);
      }
      if (route.params.invoiceMode) {
        setInvoiceMode(route.params.invoiceMode);
      }
    }
  }, [route.params]);

  const handleCreateInvoice = () => {
    if (!selectedCustomer || !invoiceType || !invoiceMode) {
      Alert.alert(
        "Can't Create the Bill",
        "Please select a customer, invoice type, and invoice mode before proceeding."
      );
      return;
    }

    const customer = customers.find(c => c.id === selectedCustomer);
    // The customer should always be found if selectedCustomer is not empty, but this is good practice.
    if (customer) {
      navigation.navigate('CreateInvoiceScreen', {
        customerId: customer.id,
        customerName: customer.name,
        invoiceType: invoiceType,
        invoiceMode: invoiceMode,
      });
    }
  };
  return (
    <LinearGradient colors={["#ff6666", "#ff0000"]} style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back-outline"
          size={28}
          color="white"
          onPress={() => navigation.navigate("HomeScreen")}
        />
        <Text style={styles.title}>Raigam SFA Invoice</Text>
        <Ionicons name="notifications-outline" size={28} color="white" />
      </View>

      <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Date / Time</Text>
          
              <Text style={styles.dateText}>
                {date.toLocaleDateString()}{" "}
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
 
          </View>


        <View style={styles.formGroup}>
          <Text style={styles.label}>Route</Text>
          <Picker
            selectedValue={selectedRoute}
            onValueChange={(itemValue) => setSelectedRoute(itemValue)}
          
                 style={styles.picker}
          >
            <Picker.Item label="Select a route" value="" />
            {(Route.routes || []).map((route: any) => (
              <Picker.Item
                key={route.id}
                label={route.routeName}
                value={route.id}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Customer</Text>
          <Picker
            selectedValue={selectedCustomer}
            onValueChange={(itemValue) => setSelectedCustomer(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Customer" value="" />
            {customers.map(customer => (
              <Picker.Item key={customer.id} label={customer.name} value={customer.id} />
            ))}
          </Picker>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Invoice Type</Text>
          <Picker
            selectedValue={invoiceType}
            onValueChange={(itemValue) => setInvoiceType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Invoice Type" value="" />
            <Picker.Item label="Normal Invoice " value="Normal" />
            <Picker.Item label="Agency Direct Invoice" value="Agency" />
            <Picker.Item label="Company Direct Invoice" value="Company" />
          </Picker>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Invoice Mode</Text>
          <Picker
            selectedValue={invoiceMode}
            onValueChange={(itemValue) => setInvoiceMode(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Invoice Mode" value="" />
            <Picker.Item label="Booking" value="Booking" />
            <Picker.Item label="Actual" value="Actual" />
          </Picker>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.button, styles.unproductiveButton]}>
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
    backgroundColor: "#0C056D",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 30,
  },
  backButtonContainer: {
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  backText: {
    color: "#fafafa",
    fontSize: 18,
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
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  picker: {
    height: 55,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
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

  datePicker: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  dateText: {
    fontSize: 16,
    color: "#555",
  },

    field: {
    marginBottom: 16,
    borderRadius: 8,
  },
});

export default CreateInvoice;
