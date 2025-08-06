// ViewLastBillScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Button,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { RootStackParamList } from "../../../navigation/AuthNavigator";


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

const ViewLastBillScreen = ({ navigation, route }: ViewLastBillScreenProps): React.JSX.Element => {
  const [bill, setBill] = useState<BillData | null>(null);
  const [loading, setLoading] = useState(true);
  const [storedCustomerName, setStoredCustomerName] = useState<string | null>(null);
  const {
    routeId,
    customerId,
    customerName,
    invoiceType,
    invoiceMode,
    
  } = route.params;
  const shopId = customerId;

 // const { shopId } = route.params as { shopId: string };

  // 🧪 Store sample bill (run once)
  const storeSampleBill = async () => {
    const sampleBill: BillData = {
      shopName: "Pathirana Super City",
      billNo: "INV-00123",
      billDate: "2025-07-15",
      items: [
        { itemName: "Soya", quantity: 3, unitPrice: 120.0, total: 360.0 },
        { itemName: "Deduma Soya", quantity: 2, unitPrice: 450.0, total: 900.0 },
        { itemName: "",quantity: 1, unitPrice: 250.0, total: 250.0 },
      ],
      grandTotal: 1510.0,
    };

    try {
      await AsyncStorage.setItem(`lastBill_${shopId}`, JSON.stringify(sampleBill));
      console.log("Sample bill stored.");
    } catch (err) {
      Alert.alert("Error", "Failed to store sample bill");
    }
  };

  // 🟢 Fetch bill from storage
  const fetchData = async () => {
    try {
      // Fetch customer name from async storage as requested
      const nameFromStorage = await AsyncStorage.getItem('customerName');
      setStoredCustomerName(nameFromStorage);

      const data = await AsyncStorage.getItem(`lastBill_${shopId}`);
      if (data) {
        setBill(JSON.parse(data));
      } else {
        await storeSampleBill();
        const newData = await AsyncStorage.getItem(`lastBill_${shopId}`);
        setBill(newData ? JSON.parse(newData) : null);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [shopId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!bill) {
    return (
      <View style={styles.centered}>
        <Text>No bill found for this shop.</Text>
      </View>
    );
  }

  const handleInvoice = () => {
    // Use the customerId and customerName passed via navigation params
    navigation.navigate('CreateInvoiceScreen', {
      routeId: routeId,
      customerId: customerId,
      customerName: customerName,
      invoiceType: invoiceType,
      invoiceMode: invoiceMode,
    });
  };







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
      <Text style={styles.heading}>Last Bill</Text>
      <Text style={styles.label}>
        Shop Name: <Text style={styles.value}>{storedCustomerName || customerName}</Text>
      </Text>
      <Text style={styles.label}>
        Bill No: <Text style={styles.value}>{bill.billNo}</Text>
      </Text>
      <Text style={styles.label}>
        Date: <Text style={styles.value}>{bill.billDate}</Text>
      </Text>

      <Text style={styles.subheading}>Items</Text>
      {bill.items.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <Text style={styles.itemName}>{item.itemName}</Text>
          <Text>
            {item.quantity} x {item.unitPrice.toFixed(2)}
          </Text>
          <Text style={styles.itemTotal}>Rs. {item.total.toFixed(2)}</Text>
        </View>
      ))}

      <Text style={styles.grandTotal}>Grand Total: Rs. {bill.grandTotal.toFixed(2)}</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Create New Invoice"
              onPress={handleInvoice}
        />
      </View>
      </View>

    </LinearGradient>
  );
};

// ✅ Styles
const styles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: "#0C056D",
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

});

export default ViewLastBillScreen;
