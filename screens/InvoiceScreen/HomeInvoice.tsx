import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

// ✅ Added missing `ReverseInvoiceScreen` type
type RootStackParamList = {
  HomeInvoice: undefined;
  CreateInvoice:
    | { customerId?: string; invoiceType?: string; invoiceMode?: string }
    | undefined;
  UnsyncedInvoicesScreen: undefined;
  InvoiceEditScreen: undefined;
  ReverseInvoiceScreen: undefined; // ✅ added this
  UpdateOutlet: undefined;
  HomeScreen: undefined;
};

// Define navigation types
type HomeInvoiceProps = NativeStackScreenProps<RootStackParamList, "HomeInvoice">;

const HomeInvoice = ({ navigation }: HomeInvoiceProps): React.ReactElement => {
  const reports = [
    { title: "Create Invoice", route: "CreateInvoice" },
    { title: "Edit Invoice", route: "InvoiceEditScreen" },
    { title: "Reverse Invoice", route: "ReverseInvoiceScreen" }, // ✅ now type-safe
    { title: "Sync Pending Invoices", route: "UnsyncedInvoicesScreen" },
  ];

  return (
    <LinearGradient colors={["#ff6666", "#ff0000"]} style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back-outline"
          size={28}
          color="white"
          onPress={() => navigation.navigate("HomeScreen")}
        />
        <Text style={styles.title}>Raigam SFA Outlet</Text>
        <Ionicons name="notifications-outline" size={28} color="white" />
      </View>

      <View style={styles.content}>
        {reports.map((report, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() =>
              navigation.navigate(report.route as keyof RootStackParamList)
            }
          >
            <Text style={styles.buttonText}>{report.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  content: {
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  button: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#cc0000",
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default HomeInvoice;
