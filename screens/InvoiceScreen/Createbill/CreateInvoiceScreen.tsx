// File: CreateInvoiceScreen.tsx

import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/AuthNavigator";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useFocusEffect } from "@react-navigation/native";
import * as Location from "expo-location";
import { useAppDispatch, useAppSelector } from "../../../store/Hooks";
import { createInvoice, fetchItems } from "../../../actions/InvoiceAction";

interface ItemType {
  category: string;
  itemName: string;
  itemId: number;
  unitPrice: string;
  quantity: string;
  specialDiscount: string;
  goodReturnQty: string;
  goodReturnFreeQty: string;
  marketReturnQty: string;
  marketReturnFreeQty: string;
  freeIssue: string;
  lineTotal: string;
  unitPriceGR: string;
  unitPriceMR: string;
  [key: string]: any;
}

type CreateInvoiceScreenProps = NativeStackScreenProps<
  RootStackParamList,
  "CreateInvoiceScreen"
>;

const CreateInvoiceScreen = ({
  navigation,
  route,
}: CreateInvoiceScreenProps): React.JSX.Element => {
  const [billDiscount, setBillDiscount] = useState<string>("0");
  const [savedItems, setSavedItems] = useState<ItemType[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const dispatch: any = useAppDispatch();
  const user = useSelector((state: RootState) => state.login.user);
  const userId = user?.data?.userId || null;
  const rangeId = user?.data?.rangeId || null;
  const territoryId = user?.data?.territoryId || null;

  const { Items: apiItems, loading: itemsLoading } = useAppSelector(
    (state: RootState) => state.Items
  );

  const {
    routeId,
    customerId = "",
    customerName = "No Customer",
    invoiceType = "N/A",
    invoiceMode = "N/A",
  } = route.params || {};

  useEffect(() => {
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
  }, []);
  useEffect(() => {
    dispatch(fetchItems());
    console.log("Fetching items from Redux store");
  }, [dispatch]);

  useFocusEffect(
    React.useCallback(() => {
      const loadItems = async () => {
        try {
          const keys = await AsyncStorage.getAllKeys();
          const itemKeys = keys.filter((k) => k.startsWith("item_"));
          const entries = await AsyncStorage.multiGet(itemKeys);
          const items = entries.map(([_, value]) => JSON.parse(value || "{}"));

          const existingItemNames = new Set(
            items.map((i: ItemType) => i.itemName)
          );
          const newApiItems: ItemType[] = apiItems
            .filter((apiItem: any) => !existingItemNames.has(apiItem.itemName))
            .map((apiItem: any) => ({
              category: apiItem.mainCatName,
              itemName: apiItem.itemName,
              itemId: apiItem.itemId,
              unitPrice: "",
              quantity: "",
              specialDiscount: "",
              goodReturnQty: "",
              goodReturnFreeQty: "",
              marketReturnQty: "",
              marketReturnFreeQty: "",
              freeIssue: "",
              lineTotal: "",
              unitPriceGR: "",
              unitPriceMR: "",
            }));

          setSavedItems([...items, ...newApiItems]);
        } catch (e) {
          console.error("Error loading saved items:", e);
        }
      };

      loadItems();
    }, [apiItems])
  );

  const categorizedItems = useMemo(() => {
    const filtered = savedItems.filter((item) =>
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return filtered.reduce((acc, item) => {
      const cat = item.category || "Selected Items";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {} as Record<string, ItemType[]>);
  }, [savedItems, searchQuery]);

  const renderItem = ({ item }: { item: ItemType }) => (
    <TouchableOpacity
      key={item.itemId}
      style={styles.itemBox}
      onPress={() => {
        navigation.navigate("ItemDetailsScreen", { customerName, item });
      }}
    >
      <Text style={styles.itemTitle}>{item.itemName}</Text>
      <View style={styles.row}>
        <Text style={styles.unitText}>Pkt</Text>
        <TextInput
          value={item.quantity}
          editable={false}
          style={styles.inputBox}
        />
        <TextInput
          value={item.goodReturnQty}
          editable={false}
          style={styles.inputBox}
        />
        <TextInput
          value={item.marketReturnQty}
          editable={false}
          style={styles.inputBox}
        />
        <TextInput
          value={item.freeIssue}
          editable={false}
          style={styles.inputBox}
        />
      </View>
      <Text style={{ fontWeight: "bold" }}>
        Line Total: Rs. {item.lineTotal}
      </Text>
    </TouchableOpacity>
  );

  const invoiceSubtotal = useMemo(() => {
    return savedItems.reduce(
      (total, item) => total + (parseFloat(item.lineTotal) || 0),
      0
    );
  }, [savedItems]);

  const billDiscountValue = useMemo(() => {
    const discountPercentage = parseFloat(billDiscount) || 0;
    return (invoiceSubtotal * discountPercentage) / 100;
  }, [invoiceSubtotal, billDiscount]);

  const invoiceNetValue = useMemo(() => {
    return invoiceSubtotal - billDiscountValue;
  }, [invoiceSubtotal, billDiscountValue]);

  const totalFreeIssue = useMemo(() => {
    return savedItems.reduce(
      (total, item) => total + (parseInt(item.freeIssue, 10) || 0),
      0
    );
  }, [savedItems]);

  const totalGoodReturns = useMemo(() => {
    return savedItems.reduce(
      (total, item) => total + (parseInt(item.goodReturnQty, 10) || 0),
      0
    );
  }, [savedItems]);

  const totalMarketReturns = useMemo(() => {
    return savedItems.reduce(
      (total, item) => total + (parseInt(item.marketReturnQty, 10) || 0),
      0
    );
  }, [savedItems]);

  return (
    <LinearGradient colors={["#ff6666", "#ff0000"]} style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.headerBar}>
          <Text style={styles.headerText}>{customerName}</Text>
          <Text
            style={styles.subHeaderText}
          >{`Type: ${invoiceType} | Mode: ${invoiceMode} | Route: ${routeId}`}</Text>
          <Text style={styles.subHeaderText}> </Text>
        </View>

        <TextInput
          placeholder="Search for items"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchBar}
        />

        <View style={styles.tableHeader}>
          {["Unit", "Qty", "GR", "MR", "Free"].map((text, idx) => (
            <Text key={idx} style={styles.headerCell}>
              {text}
            </Text>
          ))}
        </View>

        {Object.entries(categorizedItems).map(([category, items]) => (
          <View key={category}>
            <TouchableOpacity
              style={styles.categoryHeader}
              onPress={() =>
                setExpandedCategories((prev) => ({
                  ...prev,
                  [category]: !prev[category],
                }))
              }
            >
              <Text style={styles.categoryTitle}>
                {category} ({items.length}){" "}
                {expandedCategories[category] ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>

            {expandedCategories[category] &&
              (items as ItemType[]).map((item) => renderItem({ item }))}
          </View>
        ))}

        <View style={styles.invoiceBox}>
          <Text style={styles.invoiceTitle}>Invoice Details</Text>
          <Text style={styles.invoiceRow}>
            Invoice Subtotal :{" "}
            <Text style={styles.bold}>Rs. {invoiceSubtotal.toFixed(2)}</Text>
          </Text>
          <View style={styles.discountRow}>
            <Text style={styles.invoiceRow}>Bill Discount % :</Text>
            <TextInput
              value={billDiscount}
              onChangeText={setBillDiscount}
              keyboardType="numeric"
              style={styles.discountInput}
            />
          </View>
          <Text style={styles.invoiceRow}>
            Bill Discount Value :{" "}
            <Text style={styles.bold}>Rs. {billDiscountValue.toFixed(2)}</Text>
          </Text>
          <Text style={styles.invoiceRow}>
            Invoice Net Value :{" "}
            <Text style={styles.bold}>Rs. {invoiceNetValue.toFixed(2)}</Text>
          </Text>
          <Text style={[styles.invoiceRow, { marginTop: 10 }]}>
            Total Free Issues: <Text style={styles.bold}>{totalFreeIssue}</Text>
          </Text>
          <Text style={styles.invoiceRow}>
            Total Good Returns:{" "}
            <Text style={styles.bold}>{totalGoodReturns}</Text>
          </Text>
          <Text style={styles.invoiceRow}>
            Total Market Returns:{" "}
            <Text style={styles.bold}>{totalMarketReturns}</Text>
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() =>
              navigation.navigate("CreateInvoice", {
                routeId,
                customerId,
                invoiceType,
                invoiceMode,
              })
            }
          >
            <Text style={styles.buttonText}>Cancel Invoice</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.completeButton}
            onPress={async () => {
              const selectedItems = savedItems.filter(
                (item: ItemType) =>
                  (parseInt(item.quantity, 10) || 0) > 0 ||
                  (parseInt(item.goodReturnQty, 10) || 0) > 0 ||
                  (parseInt(item.marketReturnQty, 10) || 0) > 0 ||
                  (parseInt(item.freeIssue, 10) || 0) > 0
              );

              const invoiceData = {
                userId,
                rangeId,
                territoryId,
                latitude,
                longitude,
              ////////////////////////passs by login user
                routeId: routeId,
                customerName,
                customerId,
                invoiceType,
                invoiceMode,
                source: "mobile",

                billDiscount: parseFloat(billDiscount) || 0,
                billDiscountValue,
                invoiceSubtotal,
                invoiceNetValue,

                totalFreeIssue,
                totalGoodReturns,
                totalMarketReturns,
                invoiceDate: new Date().toISOString(),
                items: selectedItems,
              };
              console.log("Invoice Data:", invoiceData);

              dispatch(createInvoice(invoiceData));

              try {
                await AsyncStorage.setItem(
                  "latest_invoice",
                  JSON.stringify(invoiceData)
                );
                navigation.navigate("InvoiceFinish", { invoiceData });
              } catch (e) {
                console.error("Failed to save invoice:", e);
              }
            }}
          >
            <Text style={styles.buttonText}>Complete Invoice</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default CreateInvoiceScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  headerBar: { marginTop: 20, marginBottom: 10, alignItems: "center" },
  headerText: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  subHeaderText: { fontSize: 14, color: "#fff", marginTop: 4 },
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#d94e4e",
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  headerCell: { fontSize: 11, color: "#fff", flex: 1, textAlign: "center" },
  categoryHeader: {
    backgroundColor: "#b30000",
    padding: 8,
    borderRadius: 8,
    marginVertical: 5,
  },
  categoryTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  itemBox: {
    backgroundColor: "#eaeaea",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  itemTitle: { fontWeight: "bold", marginBottom: 6 },
  row: { flexDirection: "row", alignItems: "center" },
  unitText: { marginRight: 8, fontWeight: "bold" },
  inputBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 5,
    padding: 4,
    marginHorizontal: 3,
    textAlign: "center",
    backgroundColor: "#fff",
  },
  invoiceBox: {
    backgroundColor: "#eaeaea",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  invoiceTitle: { fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  invoiceRow: { fontSize: 14, marginVertical: 4 },
  bold: { fontWeight: "bold" },
  discountRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  discountInput: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 5,
    padding: 5,
    width: 60,
    backgroundColor: "#fff",
    marginLeft: 10,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    marginBottom: 30,
  },
  cancelButton: {
    backgroundColor: "orange",
    padding: 12,
    borderRadius: 10,
    flex: 0.48,
    alignItems: "center",
  },
  completeButton: {
    backgroundColor: "green",
    padding: 12,
    borderRadius: 10,
    flex: 0.48,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
