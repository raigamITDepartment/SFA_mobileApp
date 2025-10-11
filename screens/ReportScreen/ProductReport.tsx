import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
    ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  Platform,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppDispatch, useAppSelector } from "../../store/Hooks";
import { fetchProductSummaryReport } from "../../actions/ReportAction";
import { RootState } from "../../store";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// TypeScript types (remove if using plain JS)
type ProductSummary = {
  productId: string;
  sku?: string;
  name: string;
  soldQty: number;
  freeQty: number;
  totalBookingValue: number;
  totalSoldValue: number;
  mainCatName?: string;
  subOneCatName?: string;
  subTwoCatName?: string;
  unitOfMeasure?: string;
  discountValue: number; // total discount for product
  goodReturnQty: number;
  marketReturnQty: number;
};

type InvoiceLine = {
  invoiceId: string;
  date: string;
  qty: number;
  rate: number;
  discount: number;
  isFree?: boolean;
};

const fetchProductDetails = async (productId: string, date: string): Promise<InvoiceLine[]> => {
  await new Promise((r) => setTimeout(r, 350));
  // return mocked invoice lines for the clicked product
  return [
    {
      invoiceId: "INV-1001",
      date,
      qty: 20,
      rate: 10.0,
      discount: 2.0,
      isFree: false,
    },
    {
      invoiceId: "INV-1006",
      date,
      qty: 5,
      rate: 0.0,
      discount: 0,
      isFree: true,
    },
    {
      invoiceId: "INV-1022",
      date,
      qty: 10,
      rate: 9.5,
      discount: 1.0,
      isFree: false,
    },
  ];
};

type RootStackParamList = {
  HomeScreen: undefined;
};

export default function ProductReportScreen() {
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { territoryId } = useAppSelector((state: RootState) => state.login.user.data);
  const {
    products: summaries = [],
    loading,
    error,
  } = useAppSelector((state: RootState) => state.productReport); // Assuming 'productReport' slice in root reducer

  const [query, setQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedType, setSelectedType] = useState<
    "sold" | "free" | "discount" | "returns"
  >("sold");

  const [modalOpen, setModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<ProductSummary | null>(null);
  const [productDetails, setProductDetails] = useState<InvoiceLine[] | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"start" | "end">("start");

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0]; // 'YYYY-MM-DD'
  };

  const handleDateChange = (_event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (date) {
      if (pickerMode === "start") {
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  const showPicker = (mode: "start" | "end") => {
    setPickerMode(mode);
    setShowDatePicker(true);
  };

  const load = async () => {
    if (territoryId) {
      dispatch(
        fetchProductSummaryReport({
          territoryId,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        })
      );
    }
  };

  useEffect(() => {
    load();
  }, [dispatch, territoryId, startDate, endDate]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const openProduct = async (product: ProductSummary) => {
    setActiveProduct(product);
    setModalOpen(true);
    setDetailsLoading(true);
    try {
      const details = await fetchProductDetails(
        product.productId,
        formatDate(startDate)
      );
      setProductDetails(details);
    } catch (err) {
      console.warn("Failed to fetch product details", err);
      setProductDetails([]);
    } finally {
      setDetailsLoading(false);
    }
  };
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return summaries;
    return summaries.filter(
      (p) => p.name.toLowerCase().includes(q) || (p.sku || "").toLowerCase().includes(q)
    );
  }, [summaries, query]);

  //sort by currently selected metric
  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (selectedType) {
      case "sold":
        return arr.sort((a, b) => b.soldQty - a.soldQty);
      case "free":
        return arr.sort((a, b) => b.freeQty - a.freeQty);
      case "discount":
        return arr.sort((a, b) => b.discountValue - a.discountValue);
      default:
        // returns -> combine good + market
        return arr.sort((a, b) => (b.goodReturnQty + b.marketReturnQty) - (a.goodReturnQty + a.marketReturnQty));
    }
  }, [filtered, selectedType]);

  const renderItem = ({ item }: { item: ProductSummary }) => {
    const metricLabel = (() => {
      switch (selectedType) {
        case "sold": {
          const soldValue = item.totalSoldValue ?? item.totalBookingValue;
          return (
            `${item.soldQty} sold\nRs. ${soldValue.toFixed(2)}`
          );
        }
        case "free":
          return `${item.freeQty} free`;
        case "discount":
          return `Rs. ${item.discountValue.toFixed(2)} discount`;
        default:
          return `G:${item.goodReturnQty} M:${item.marketReturnQty}`;
      }
    })();

    return (
      <TouchableOpacity
        onPress={() => openProduct(item)}
        style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>SKU: {item.sku || item.productId}</Text>
          <Text style={styles.subtitle}>
            Category: {item.mainCatName} &gt; {item.subOneCatName}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.metric} numberOfLines={2}>{metricLabel}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (

    <SafeAreaView style={styles.container}>
    

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator />
          <Text style={styles.small}>Loading summaries...</Text>
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(i) => i.productId}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12, paddingBottom: 120 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListHeaderComponent={
            <>
              <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.screenTitle}>Sales & Returns Summary</Text>
              </View>
              <View style={styles.controlsRow}>
                <TouchableOpacity onPress={() => showPicker("start")} style={styles.dateButton}>
                  <Text style={styles.dateText}>Start: {formatDate(startDate)}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showPicker("end")} style={styles.dateButton}>
                  <Text style={styles.dateText}>End: {formatDate(endDate)}</Text>
                </TouchableOpacity>
              </View>
              {showDatePicker && (
                <DateTimePicker
                  value={pickerMode === "start" ? startDate : endDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
              <View style={styles.controlsRow}>
                <TextInput
                  placeholder="Search product or SKU"
                  value={query}
                  onChangeText={setQuery}
                  style={styles.searchInput}
                />
              </View>
              <View style={styles.segmentRow}>
                {(
                  [
                    { key: "sold", label: "Sold" },
                    { key: "free", label: "Free" },
                    { key: "discount", label: "Discount" },
                    { key: "returns", label: "Returns" },
                  ] as { key: "sold" | "free" | "discount" | "returns"; label: string }[]
                ).map((s) => (
                  <TouchableOpacity
                    key={s.key}
                    onPress={() => setSelectedType(s.key)}
                    style={[styles.segmentButton, selectedType === s.key && styles.segmentButtonActive]}>
                    <Text style={[styles.segmentText, selectedType === s.key && styles.segmentTextActive]}>{s.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          }
          ListEmptyComponent={() => (
            <View style={styles.empty}><Text>No products found for selected date</Text></View>
          )}
        />
      )}

      {/* Details modal when a product is clicked */}
      <Modal visible={modalOpen} animationType="slide" onRequestClose={() => setModalOpen(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{activeProduct?.name}</Text>
            <TouchableOpacity onPress={() => setModalOpen(false)} style={styles.closeBtn}>
              <Text style={{ fontWeight: "600" }}>Close</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalSummaryRow}>
            <View style={styles.modalStat}>
                  <Text style={styles.modalStatLabel}>Sold Qty</Text>
              <Text style={styles.modalStatValue}>{activeProduct?.soldQty ?? "-"}</Text>
          
            </View>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatValue}>{activeProduct?.freeQty ?? "-"}</Text>
              <Text style={styles.modalStatLabel}>Free</Text>
            </View>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatValue}>{activeProduct?.discountValue?.toFixed(2) ?? "-"}</Text>
              <Text style={styles.modalStatLabel}>Discount</Text>
            </View>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatValue}>{(activeProduct?.goodReturnQty ?? 0) + (activeProduct?.marketReturnQty ?? 0)}</Text>
              <Text style={styles.modalStatLabel}>Returns</Text>
            </View>
          </View>
          <View style={styles.modalSummaryRow}>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatValue}>{activeProduct?.totalBookingValue?.toFixed(2) ?? "-"}</Text>
              <Text style={styles.modalStatLabel}>Booking Value</Text>
            </View>
            <View style={styles.modalStat}>
              <Text style={styles.modalStatValue}>{activeProduct?.totalSoldValue?.toFixed(2) ?? "-"}</Text>
              <Text style={styles.modalStatLabel}>Sold Value</Text>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            {detailsLoading ? (
              <View style={{ marginTop: 40, alignItems: "center" }}>
                <ActivityIndicator />
                <Text style={styles.small}>Loading invoice lines...</Text>
              </View>
            ) : (
              <FlatList
                data={productDetails || []}
                keyExtractor={(r) => `${r.invoiceId}-${r.qty}-${r.rate}`}
                renderItem={({ item }) => (
                  <View style={styles.invoiceRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.invoiceTitle}>{item.invoiceId}</Text>
                      <Text style={styles.small}>{item.date}</Text>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <Text style={{ fontWeight: "700" }}>{item.qty} pcs</Text>
                      <Text style={styles.small}>Rate {item.rate}</Text>
                      {item.isFree && <Text style={[styles.small, { color: "green" }]}>Free Issue</Text>}
                      {item.discount > 0 && <Text style={styles.small}>Disc {item.discount}</Text>}
                    </View>
                  </View>
                )}
                ListEmptyComponent={() => (
                  <View style={{ padding: 20 }}><Text>No invoice lines for this product</Text></View>
                )}
              />
            )}
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f7fb" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  backButton: {
    marginRight: 16,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: "700",
    flex: 1,
  },
  controlsRow: { flexDirection: "row", paddingHorizontal: 12, gap: 8, alignItems: "center" },
  dateButton: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    marginVertical: 5,
  },
  dateText: {
    color: "#333",
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  segmentRow: { flexDirection: "row", padding: 12, gap: 8 },
  segmentButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "transparent",
  },
  segmentButtonActive: { backgroundColor: "#0b74ff33", borderColor: "#0b74ff" },
  segmentText: { fontWeight: "600" },
  segmentTextActive: { color: "#0b74ff" },
  card: {
    backgroundColor: "#fff",
    marginBottom: 10,
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  title: { fontSize: 15, fontWeight: "700" },
  subtitle: { fontSize: 12, color: "#666", marginTop: 4 },
  metric: { fontWeight: "700", fontSize: 14, textAlign: "right" },
  small: { fontSize: 12, color: "#666" },
  loadingWrap: { padding: 24, alignItems: "center" },
  empty: { padding: 30, alignItems: "center" },

  modalContainer: { flex: 1, backgroundColor: "#fff" },
  modalHeader: { padding: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  modalTitle: { fontSize: 16, fontWeight: "800" },
  closeBtn: { padding: 8 },
  modalSummaryRow: { flexDirection: "row", justifyContent: "space-between", padding: 12 },
  modalStat: { alignItems: "center", flex: 1 },
  modalStatValue: { fontSize: 18, fontWeight: "800" },
  modalStatLabel: { fontSize: 12, color: "#666" },

  invoiceRow: {
    backgroundColor: "#f7f8fb",
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  invoiceTitle: { fontWeight: "700" },
});

/*
        <FlatList
          data={sorted}
          keyExtractor={(i) => i.productId}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 12, paddingBottom: 120 }} // Note: I've corrected a typo here from `paddingBotton` to `paddingBottom`
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={() => (
            <View style={styles.empty}><Text>No products found for selected date</Text></View>
          )}
        />
*/
