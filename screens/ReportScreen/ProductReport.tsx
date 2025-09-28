import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

// TypeScript types (remove if using plain JS)
type ProductSummary = {
  productId: string;
  sku?: string;
  name: string;
  soldQty: number;
  freeQty: number;
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

// Mock API -- replace with your real API calls
const fetchEodProductSummaries = async (date: string): Promise<ProductSummary[]> => {
  // simulate network delay
  await new Promise((r) => setTimeout(r, 450));
  return [
    {
      productId: "P-001",
      sku: "SALT-01",
      name: "Table Salt 1kg",
      soldQty: 120,
      freeQty: 5,
      discountValue: 48.0,
      goodReturnQty: 2,
      marketReturnQty: 1,
    },
    {
      productId: "P-002",
      sku: "SOYA-01",
      name: "Soya Sauce 500ml",
      soldQty: 80,
      freeQty: 2,
      discountValue: 32.0,
      goodReturnQty: 0,
      marketReturnQty: 3,
    },
    {
      productId: "P-003",
      sku: "JUICE-01",
      name: "Orange Powder 200g",
      soldQty: 200,
      freeQty: 10,
      discountValue: 90.0,
      goodReturnQty: 4,
      marketReturnQty: 0,
    },
  ];
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

export default function EODReportsScreen() {
  const [date, setDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  });

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [summaries, setSummaries] = useState<ProductSummary[]>([]);
  const [selectedType, setSelectedType] = useState<
    "sold" | "free" | "discount" | "returns"
  >("sold");

  const [modalOpen, setModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<ProductSummary | null>(null);
  const [productDetails, setProductDetails] = useState<InvoiceLine[] | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const load = async (d = date) => {
    setLoading(true);
    try {
      const res = await fetchEodProductSummaries(d);
      setSummaries(res);
    } catch (err) {
      console.warn("Failed to load EOD summaries", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [date]);

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
      const details = await fetchProductDetails(product.productId, date);
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

  // sort by currently selected metric
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
        case "sold":
          return `${item.soldQty} sold`;
        case "free":
          return `${item.freeQty} free`;
        case "discount":
          return `Rs. ${item.discountValue.toFixed(2)} discount`;
        default:
          return `G:${item.goodReturnQty} M:${item.marketReturnQty}`;
      }
    })();

    return (
      <TouchableOpacity onPress={() => openProduct(item)} style={styles.card}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>{item.sku || item.productId}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.metric}>{metricLabel}</Text>
          <Text style={styles.small}>Tap to view invoice list</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}> Sales & Returns Summary</Text>
      </View>

      <View style={styles.controlsRow}>
        <TextInput
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
          style={styles.dateInput}
        />
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
          ] as { key: string; label: string }[]
        ).map((s) => (
          <TouchableOpacity
            key={s.key}
            onPress={() => setSelectedType(s.key as any)}
            style={[styles.segmentButton, selectedType === s.key && styles.segmentButtonActive]}
          >
            <Text style={[styles.segmentText, selectedType === s.key && styles.segmentTextActive]}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

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
              <Text style={styles.modalStatValue}>{activeProduct?.soldQty ?? "-"}</Text>
              <Text style={styles.modalStatLabel}>Sold</Text>
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
  headerRow: { padding: 12 },
  screenTitle: { fontSize: 18, fontWeight: "700" },
  controlsRow: { flexDirection: "row", paddingHorizontal: 12, gap: 8, alignItems: "center" },
  dateInput: {
    flex: 0.35,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  searchInput: {
    flex: 0.65,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
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
  metric: { fontWeight: "700", fontSize: 14 },
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
