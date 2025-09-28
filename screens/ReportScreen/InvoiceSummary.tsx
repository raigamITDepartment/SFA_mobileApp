import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppDispatch, useAppSelector } from "../../store/Hooks";
import {
  fetchInvoiceSummaryReport,
  fetchInvoiceDetailsById,
} from "../../actions/ReportAction";
import { InvoiceReportItem } from "../../reducers/InvoiceReportReducer";
import InvoiceDetailsModal from "./InvoiceDetailsModal";
import { resetInvoiceDetails } from "../../reducers/InvoiceDetailsReducer";

const InvoiceSummaryByDateScreen = () => {
  const dispatch = useAppDispatch();
  const { territoryId } = useAppSelector((state) => state.login.user.data);

  // ✅ Safe default: invoices = []
  const {
    invoices = [],
    loading,
    error,
  } = useAppSelector((state) => state.invoiceReport);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<"start" | "end">("start");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

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

  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0]; // 'YYYY-MM-DD'
  };

  const showPicker = (mode: "start" | "end") => {
    setPickerMode(mode);
    setShowDatePicker(true);
  };

  const handleInvoicePress = (invoiceId: number) => {
    if (invoiceId) {
      dispatch(fetchInvoiceDetailsById(invoiceId));
      setModalVisible(true);
    }
  };
  useEffect(() => {
    if (territoryId) {
      dispatch(
        fetchInvoiceSummaryReport({
          territoryId,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        })
      );

      console.log(
        "Fetching invoice report for date:",
        formatDate(startDate),
        territoryId,
        formatDate(endDate)
      );
      console.log("Invoices data:", invoices);
    }
  }, [dispatch, territoryId, startDate, endDate]);

  const filteredInvoices = invoices.filter(
    (inv) =>
      searchQuery === "" ||
      inv.invoiceNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(inv.outletId).includes(searchQuery)
  );

  const { dailyTotalNet, dailyInvoiceCount, bookingCount, actualCount } =
    useMemo(() => {
      const bookings = filteredInvoices.filter(
        (inv) => inv.isBook && !inv.isActual
      ).length;
      const actuals = filteredInvoices.filter((inv) => inv.isActual).length;

      return {
        dailyTotalNet: filteredInvoices.reduce(
          (total, inv) => total + (inv.totalBookValue || 0),
          0
        ),
        dailyInvoiceCount: filteredInvoices.length,
        bookingCount: bookings,
        actualCount: actuals,
      };
    }, [filteredInvoices]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Invoice Summary Report</Text>

      <View style={styles.datePickerContainer}>
        <Pressable
          onPress={() => showPicker("start")}
          style={styles.dateButton}
        >
          <Text style={styles.dateText}>
            Start Date: {formatDate(startDate)}
          </Text>
        </Pressable>
        <Pressable onPress={() => showPicker("end")} style={styles.dateButton}>
          <Text style={styles.dateText}>End Date: {formatDate(endDate)}</Text>
        </Pressable>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={pickerMode === "start" ? startDate : endDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      <TextInput
        style={styles.searchInput}
        placeholder="Search by Invoice No / Outlet ID"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>
          Total Productive Calls: {dailyInvoiceCount}
        </Text>
        <Text style={styles.summaryDetailText}>- Bookings: {bookingCount}</Text>
        <Text style={styles.summaryDetailText}>- Actual: {actualCount}</Text>
        <Text style={styles.summaryText}>Total UnProductive Calls:</Text>
        <Text style={styles.summaryText}>
          Total Net Value: Rs. {dailyTotalNet.toFixed(2)}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1D4ED8" />
      ) : error ? (
        <Text style={styles.noData}>
          Error fetching data. Please try again.
        </Text>
      ) : filteredInvoices.length === 0 ? (
        <Text style={styles.noData}>No invoices found for this date.</Text>
      ) : (
        filteredInvoices.map((invoice: InvoiceReportItem) => {
          // Ensure invoice.id is a number before passing
          const invoiceId = Number(invoice.id);
          return (
            <Pressable
              key={`${invoice.id}-${invoice.invoiceNo}`}
              onPress={() => handleInvoicePress(invoiceId)}
            >
              <View style={styles.invoiceBox}>
                <Text style={styles.subTitle}>
                  Invoice: {invoice.invoiceNo}
                </Text>
                <View style={styles.detailRow}>
                  <Text>Outlet ID:</Text>
                  <Text style={styles.detailValue}>{invoice.outletId}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text>Type:</Text>
                  <Text style={styles.detailValue}>{invoice.invoiceType}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text>Mode:</Text>
                  <Text style={styles.detailValue}>
                    {invoice.isActual
                      ? "Actual"
                      : invoice.isBook
                      ? "Booking"
                      : "N/A"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text>Route:</Text>
                  <Text style={styles.detailValue}>{invoice.routeName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text>Shop:</Text>
                  <Text style={styles.detailValue}>{invoice.outletName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text>Discount:</Text>
                  <Text style={styles.detailValue}>
                    {invoice.discountPercentage}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text>Discount Value:</Text>
                  <Text style={styles.detailValue}>
                    {invoice.totalDiscountValue}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text>Free Issue Value:</Text>
                  <Text style={styles.detailValue}>
                    {invoice.totalFreeValue}
                  </Text>
                </View>
                <Text style={styles.total}>
                  Value: Rs. {(invoice.totalBookValue || 0).toFixed(2)}
                </Text>
                <Text style={styles.dateBook}>Date: {invoice.dateBook}</Text>
              </View>
            </Pressable>
          );
        })
      )}
      <InvoiceDetailsModal
        visible={isModalVisible}
        onClose={() => {
          setModalVisible(false);
          dispatch(resetInvoiceDetails());
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F4F6F8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#1F2937",
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateButton: {
    backgroundColor: "#E0F2FE",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  dateText: {
    fontSize: 16,
    color: "#1D4ED8",
  },
  searchInput: {
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
  },
  subTitle: {
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 5,
  },
  summaryBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  summaryDetailText: {
    fontSize: 15,
    paddingLeft: 15,
    color: "#374151",
  },
  noData: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
  invoiceBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  total: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 16,
    color: "#16A34A",
    textAlign: "right",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  detailValue: { fontWeight: "600" },
  dateBook: {
    textAlign: "right",
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
});

export default InvoiceSummaryByDateScreen;
