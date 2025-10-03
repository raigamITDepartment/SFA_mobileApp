// File: /home/thusitha/SFA_mobile/git2/SFA_mobileApp/screens/InvoiceScreen/Createbill/CreateInvoiceScreen.tsx

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
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
import {
  createInvoice,
  fetchItems,
  resetCreateInvoiceState,
} from "../../../actions/InvoiceAction";

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
  sellPriceId?: number | null;
  goodReturnPriceId?: number | null;
  marketReturnPriceId?: number | null;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [longitude, setLongitude] = useState<number | null>(null);
  const dispatch = useAppDispatch();
  const itemsFetchedRef = useRef(false);
  const user = useSelector((state: RootState) => state.login.user);
  const userId = user?.data?.userId || null;
  const rangeId = user?.data?.rangeId || null;
  const territoryId = user?.data?.territoryId || null;
  const agencyWarehouseId = user?.data?.agencyWarehouseId || 1; // Default to 1 as per API example

  const { Items: apiItems = [], loading: itemsLoading } = useAppSelector(
    (state: RootState) => state.Items
  );

  const {
    loading: createInvoiceLoading,
    success: createInvoiceSuccess,
    error: createInvoiceError,
  } = useAppSelector((state: RootState) => state.Invoice);
  const [latestInvoiceData, setLatestInvoiceData] = useState<any>(null);

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
    if (territoryId && !itemsFetchedRef.current) {
      dispatch(fetchItems(Number(territoryId)));
      console.log("Fetching items from Redux store");
      itemsFetchedRef.current = true;
    }
  }, [dispatch, territoryId]);

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

          const newApiItems: ItemType[] = (apiItems || [])
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

  useEffect(() => {
    if (createInvoiceSuccess && latestInvoiceData) {
      const navigateToFinish = async () => {
        try {
          await AsyncStorage.setItem(
            "latest_invoice",
            JSON.stringify(latestInvoiceData)
          );
          navigation.navigate("InvoiceFinish", {
            invoiceData: latestInvoiceData,
          });
        } catch (e) {
          console.error(
            "Failed to save or navigate after invoice creation:",
            e
          );
        } finally {
          dispatch(resetCreateInvoiceState());
          setLatestInvoiceData(null);
        }
      };
      navigateToFinish();
    }
    if (createInvoiceError) {
      Alert.alert("Error", "Failed to create invoice. Please try again.");
      dispatch(resetCreateInvoiceState());
      setIsSubmitting(false); // Allow user to try again on error
    }
  }, [
    createInvoiceSuccess,
    createInvoiceError,
    latestInvoiceData,
    navigation,
    dispatch,
  ]);

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
    const d = parseFloat(billDiscount) || 0;
    return (invoiceSubtotal * d) / 100;
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

  const mappedItems = useMemo(() => {
    const selectedItems = savedItems.filter(
      (item: ItemType) =>
        (parseInt(item.quantity, 10) || 0) > 0 ||
        (parseInt(item.goodReturnQty, 10) || 0) > 0 ||
        (parseInt(item.marketReturnQty, 10) || 0) > 0 ||
        (parseInt(item.freeIssue, 10) || 0) > 0
    );

    return selectedItems.map((item) => {
      const parse = (val: string) => parseFloat(val) || 0;
      const parseIntVal = (val: string) => parseInt(val, 10) || 0;

      const sellUnitPrice = parse(item.unitPrice);
      const sellPriceId = item.sellPriceId ?? null;
      const totalBookQty = parseIntVal(item.quantity);
      const totalFreeQty = parseIntVal(item.freeIssue);
      const discountPercentage = parse(item.specialDiscount);

      const baseAmount = sellUnitPrice * totalBookQty;
      const totalDiscountValue = baseAmount * (discountPercentage / 100);
      const sellTotalPrice =
        totalDiscountValue === 0
          ? baseAmount
          : baseAmount - totalDiscountValue;

          console.log("Item Mapping Debug:",sellTotalPrice )
  

      const goodReturnUnitPrice = parse(item.unitPriceGR);
      const goodReturnTotalQty = parseIntVal(item.goodReturnQty); // Quantity of good returns for this item
      const goodReturnFreeQty = parseIntVal(item.goodReturnFreeQty); // Free quantity of good returns for this item
      const goodReturnTotalVal =
        goodReturnUnitPrice *
        Math.max(goodReturnTotalQty - goodReturnFreeQty, 0);

      const marketReturnUnitPrice = parse(item.unitPriceMR);
      const marketReturnTotalQty = parseIntVal(item.marketReturnQty); // Quantity of market returns for this item
      const marketReturnFreeQty = parseIntVal(item.marketReturnFreeQty); // Free quantity of market returns for this item
      const marketReturnTotalVal =
        marketReturnUnitPrice *
        Math.max(marketReturnTotalQty - marketReturnFreeQty, 0);

      const bookingData = {
        totalBookQty,
        bookDiscountPercentage: discountPercentage,
        totalBookDiscountValue: totalDiscountValue,
        totalBookSellValue: sellTotalPrice,
        totalBookValue: baseAmount,
        itemSellTotalPrice: sellTotalPrice, // Net price for this item after special discount
        sellTotalPrice: 0, // This maps to sell_total in the backend
        totalActualQty: 0,
        totalDiscountValue: 0,
        discountPercentage: 0,
      };

      const actualData = {
        totalBookQty,
        bookDiscountPercentage: discountPercentage,
        totalBookDiscountValue: totalDiscountValue,
        totalBookSellValue: sellTotalPrice,
        totalBookValue: baseAmount,
        itemSellTotalPrice: sellTotalPrice, // Net price for this item after special discount
        totalActualQty: totalBookQty, // Assuming actual qty is same as booking qty
        totalDiscountValue: totalDiscountValue,
        discountPercentage: discountPercentage,
        sellTotalPrice: sellTotalPrice, // This maps to sell_total in the backend
      };

      const commonItemData = {
        itemId: item.itemId,
        sellPriceId,
        sellUnitPrice,
        totalCancelQty: 0,
        totalFreeQty,
        goodReturnPriceId: item.goodReturnPriceId ?? null,
        goodReturnUnitPrice,
        goodReturnFreeQty,
        goodReturnTotalQty,
        goodReturnTotalVal,
        marketReturnPriceId: item.marketReturnPriceId ?? null,
        marketReturnFreeQty,
        marketReturnTotalQty,
        marketReturnTotalVal,
        marketReturnUnitPrice,
        finalTotalValue: parse(item.lineTotal),
        isActive: true,
      };

      if (invoiceMode === "1") {
        // Booking
        return { ...commonItemData, ...bookingData };
      } else {
        // Actual (invoiceMode === "2")
        return { ...commonItemData, ...bookingData, ...actualData };
      }
    });
  }, [savedItems, invoiceMode]);

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

          {isSubmitting || createInvoiceLoading ? (
            <View style={[styles.completeButton, styles.loadingButton]}>
              <ActivityIndicator color="#fff" />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.completeButton}
              onPress={async () => {
                // Prevent multiple submissions
                if (isSubmitting) {
                  return;
                }
                setIsSubmitting(true);

              const selectedItemsForUI = savedItems.filter(
                (item: ItemType) =>
                  (parseInt(item.quantity, 10) || 0) > 0 ||
                  (parseInt(item.goodReturnQty, 10) || 0) > 0 ||
                  (parseInt(item.marketReturnQty, 10) || 0) > 0 ||
                  (parseInt(item.freeIssue, 10) || 0) > 0
              );
          const finalTotalValue = mappedItems.reduce(
                (sum, item) => sum + item.finalTotalValue,
                0
              );

              const totalValueAllItem = mappedItems.reduce(
                (sum, item) => sum + item.itemSellTotalPrice,
                0
              );

              // Sum of (unitPrice * quantity) for all items (Gross total before any item discounts)
              const totalGrossBookValue = mappedItems.reduce(
                (sum, item) => sum + item.sellUnitPrice * item.totalBookQty,
                0
              );
              const totalGoodReturnValue = mappedItems.reduce(
                (sum, item) => sum + item.goodReturnTotalVal,
                0
              );
              const totalMarketReturnValue = mappedItems.reduce(
                (sum, item) => sum + item.marketReturnTotalVal,
                0
              );
              const totalFreeValue = mappedItems.reduce(
                (sum, item) => sum + item.sellUnitPrice * item.totalFreeQty,
                0
              );

              const totalBillDiscountAmount = billDiscountValue; // The calculated bill discount amount

              // Net total after item-level and bill discounts (before considering returns)
              const netTotalAfterAllDiscounts = finalTotalValue - totalBillDiscountAmount;

              const netTotalwithoutGRMR =
                 totalValueAllItem - totalBillDiscountAmount;
              console.log("netTotalwithoutGRMR", netTotalwithoutGRMR);
              console.log("sellTotalPrice", totalValueAllItem);

              // Final invoice net value (after all discounts and returns)
              const finalInvoiceNetValue = invoiceNetValue; // This is already calculated in the UI section

              // This object is for UI and navigation to InvoiceFinish screen
              const uiInvoiceData = {
                userId,
                rangeId,
                territoryId,
                latitude,
                longitude,
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
                items: selectedItemsForUI,
              };

              // Generate a unique 6-digit number for client-side identification

              // const generateUniqueId = () => {
              //   return Math.floor(100000 + Math.random() * 900000000000000);
              // };
 
              setLatestInvoiceData(uiInvoiceData);
              // This object is for the API call - base data
              const baseApiData = {
                userId:userId || 0,
                territoryId,
                agencyWarehouseId,
                routeId: Number(routeId),
                rangeId,
                outletId: Number(customerId),
              //  clientGeneratedId: generateUniqueId(),

                invoiceType,
                sourceApp: "MOBILE",
                longitude,
                latitude: latitude || 0,
                isReversed: false,
                isPrinted: invoiceMode === "2",
                isBook: true, // isBook is true for both Booking and Actual modes
                isActual: invoiceMode === "2",
                isLateDelivery: false,
                invActualBy: 0,
                invReversedBy: 0,
                invUpdatedBy: 0,
                isActive: true,
                invoiceDetailDTOList: mappedItems,
                totalCancelValue: 0.0,
                discountPercentage: parseFloat(billDiscount) || 0,
                totalMarketReturnValue: totalMarketReturnValue || 0,
                totalGoodReturnValue: totalGoodReturnValue || 0,
                totalFreeValue: totalFreeValue || 0,
                totalBookValue: totalGrossBookValue,
                totalActualValue: invoiceMode === "2" ? finalInvoiceNetValue : 0,
                totalDiscountValue: totalBillDiscountAmount,
              };
             console.log("Base API Data Create Invoice:", userId);

              let apiInvoiceData;
             
              if (invoiceMode === "1") {
                // Booking stage
                apiInvoiceData = {
                  ...baseApiData,
                  totalBookSellValue: netTotalwithoutGRMR, // Net total after item and bill discounts
                 
                  totalBookValue: totalGrossBookValue, // Gross total before any discounts
                  totalBookFinalValue: netTotalAfterAllDiscounts, // Total after item-level discounts

                  totalActualValue: 0,
                  totalDiscountValue: totalBillDiscountAmount,
                };
              } else {
                // Actual stage (invoiceMode === "2")
                apiInvoiceData = {
                  ...baseApiData,
                  // Booking stage fields
                  totalBookSellValue: netTotalwithoutGRMR, // Net total after item and bill discounts
                  totalBookValue: totalGrossBookValue, // Gross total before any discounts
                  totalBookFinalValue: netTotalAfterAllDiscounts, // Total after item-level discounts
                  // Actual stage fields

                  totalActualValue: finalInvoiceNetValue, // Final net value for actual mode
                  totalDiscountValue: totalBillDiscountAmount,
                };
              }

              // console.log(
              //   "Invoice Data for API:",
              //   JSON.stringify(apiInvoiceData, null, 2)
              // );
              dispatch(createInvoice(apiInvoiceData));
            }}
            >
              <Text style={styles.buttonText}>Complete Invoice</Text>
            </TouchableOpacity>
          )}
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
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingRight: 10,
    paddingLeft: 50,
    marginTop: 10,
  },
  headerCell: {
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
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
  loadingButton: {
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
