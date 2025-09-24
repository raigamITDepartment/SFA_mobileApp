// ViewLastBillScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { RootStackParamList } from "../../../navigation/AuthNavigator";
import { useAppDispatch, useAppSelector } from "../../../store/Hooks";
import {
  fetchLastThreeInvoices,
  fetchInvoiceDetailsById,
} from "../../../actions/ReportAction";
import InvoiceDetailsModal from "./InvoiceDetailsModal";
import { resetInvoiceDetails } from "../../../reducers/InvoiceDetailsReducer";

type ViewLastBillScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "ViewLastBillScreen"
>;
// Types
interface BillItem {
  itemName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface BillData {
  shopName: string;
  billNo: string;
  billDate: string;
  items: BillItem[];
  grandTotal: number;
}

const ViewLastBillScreen = ({
  navigation,
  route,
}: ViewLastBillScreenProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { routeId, customerId, customerName, invoiceType, invoiceMode } =
    route.params;
  const outletId = Number(customerId);
  const [isModalVisible, setModalVisible] = useState(false);

  console.log("Outlet ID:", outletId);

  const {
    invoices: lastInvoices,
    loading,
    error,
  } = useAppSelector((state) => state.lastThreeInvoices);

  useEffect(() => {
    if (outletId) {
      dispatch(fetchLastThreeInvoices(outletId));
    }
  }, [dispatch, outletId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error fetching last bills. Please try again.</Text>
      </View>
    );
  }

  const handleInvoicePress = (invoiceId: number) => {
    if (invoiceId) {
      dispatch(fetchInvoiceDetailsById(invoiceId));
      setModalVisible(true);
    }
  };

  const handleInvoice = () => {
    // Use the customerId and customerName passed via navigation params
    navigation.navigate("CreateInvoiceScreen", {
      routeId: routeId,
      customerId: customerId,
      customerName: customerName,
      invoiceType: invoiceType,
      invoiceMode: invoiceMode,
    });
  };

  console.log("Bill Data:", customerName, customerId, invoiceType, invoiceMode);

  return (
    <LinearGradient colors={["#ff6666", "#ff0000"]} style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back-outline"
          size={28}
          color="white"
          onPress={() => navigation.navigate("CreateInvoice")}
        />
        <Text style={styles.title}>Raigam SFA Invoice</Text>
        <Ionicons name="notifications-outline" size={28} color="white" />
      </View>
      <View style={styles.form}>
        <Text style={styles.heading}>Last Bill History</Text>

        <View style={styles.lastBillsContainer}>
          {lastInvoices.length > 0 ? (
            lastInvoices.map((invoice) => (
              <Button
                key={invoice.id}
                mode="contained"
                onPress={() => handleInvoicePress(invoice.id)}
                style={styles.lastBillButton}
              >
                <View>
                  <Text
                    style={styles.lastBillButtonText}
                  >{`${invoice.invoiceNo} - ${invoice.dateActual}`}</Text>
                  <Text
                    style={styles.lastBillButtonText}
                  >{`Rs. ${invoice.totalActualValue.toFixed(2)}`}</Text>
                </View>
              </Button>
            ))
          ) : (
            <Text style={styles.noBillsText}>No recent invoices found.</Text>
          )}
          <InvoiceDetailsModal
            visible={isModalVisible}
            onClose={() => {
              setModalVisible(false);
              dispatch(resetInvoiceDetails());
            }}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleInvoice}
            style={styles.newInvoiceButton}
            labelStyle={styles.newInvoiceButtonText}
          >
            Create New Invoice
          </Button>
        </View>
      </View>
    </LinearGradient>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //  backgroundColor: "#0C056D",
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subheading: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 8,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  value: {
    fontWeight: "bold",
  },
  itemRow: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 8,
  },
  itemName: {
    fontWeight: "600",
  },
  itemTotal: {
    fontWeight: "bold",
    textAlign: "right",
  },
  grandTotal: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "right",
  },
  buttonContainer: {
    marginTop: 30,
  },
  lastBillsContainer: {
    alignItems: "stretch", // Make buttons take full width
    marginVertical: 20,
  },
  lastBillButton: {
    borderRadius: 8,
    backgroundColor: "#cc0000",
    marginBottom: 10, // Add space between buttons
  },
  lastBillButtonText: {
    fontSize: 14,
    color: "white",
  },
  newInvoiceButton: {
    paddingVertical: 8,
    backgroundColor: "#4caf50",
  },
  newInvoiceButtonText: { fontSize: 16, fontWeight: "bold" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
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
  noBillsText: {
    textAlign: "center",
    color: "#666",
    marginVertical: 20,
  },
});

export default ViewLastBillScreen;
