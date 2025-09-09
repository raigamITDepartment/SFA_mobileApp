import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppDispatch, useAppSelector } from '../../store/Hooks';
import { fetchInvoiceSummaryReport } from '../../actions/ReportAction';
import { InvoiceReportItem } from '../../reducers/InvoiceReportReducer';

const InvoiceSummaryByDateScreen = () => {
  const dispatch = useAppDispatch();
  const { territoryId } = useAppSelector((state) => state.login.user.data);

  // ✅ Safe default: invoices = []
  const { invoices = [], loading, error } = useAppSelector(
    (state) => state.invoiceReport
  );

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDateChange = (_event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  };

  useEffect(() => {
    if (territoryId) {
      const dateStr = formatDate(selectedDate);
      dispatch(
        fetchInvoiceSummaryReport({ territoryId, startDate: dateStr, endDate: dateStr })
      );

       console.log('Fetching invoice report for date:', dateStr, territoryId, dateStr )
       console.log('Invoices data:', invoices);
    }
  }, [dispatch, territoryId, selectedDate]);

  const filteredInvoices = invoices.filter(
    (inv) =>
      searchQuery === '' ||
      inv.invoiceNo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(inv.outletId).includes(searchQuery)
  );

  const { dailyTotalNet, dailyInvoiceCount, bookingCount, actualCount } = useMemo(() => {
    const bookings = filteredInvoices.filter(inv => inv.isBook && !inv.isActual).length;
    const actuals = filteredInvoices.filter(inv => inv.isActual).length;

    return {
      dailyTotalNet: filteredInvoices.reduce(
        (total, inv) => total + (inv.totalBookValue || 0),
        0,
      ),
      dailyInvoiceCount: filteredInvoices.length,
      bookingCount: bookings,
      actualCount: actuals,
    };
  }, [filteredInvoices]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Invoice Summary By Date</Text>

      <Pressable onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
        <Text style={styles.dateText}>
          Selected Date: {formatDate(selectedDate)}
        </Text>
      </Pressable>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
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
        <Text style={styles.summaryDetailText}>
          - Bookings: {bookingCount}
        </Text>
        <Text style={styles.summaryDetailText}>
          - Actual: {actualCount}
        </Text>
        <Text style={styles.summaryText}>
          Total UnProductive Calls:
        </Text>
        <Text style={styles.summaryText}>
          Total Net Value: Rs. {dailyTotalNet.toFixed(2)}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#1D4ED8" />
      ) : error ? (
        <Text style={styles.noData}>Error fetching data. Please try again.</Text>
      ) : filteredInvoices.length === 0 ? (
        <Text style={styles.noData}>No invoices found for this date.</Text>
      ) : (
        filteredInvoices.map((invoice: InvoiceReportItem) => (
          <View key={`${invoice.id}-${invoice.invoiceNo}`} style={styles.invoiceBox}>
            <Text style={styles.subTitle}>Invoice: {invoice.invoiceNo}</Text>
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
              <Text style={styles.detailValue}>{invoice.isActual ? 'Actual' : (invoice.isBook ? 'Booking' : 'N/A')}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text>Route:</Text>
              <Text style={styles.detailValue}>{invoice.routeName}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text>Shop:</Text>
              <Text style={styles.detailValue}>{invoice.outletName}</Text>
            </View>
            <Text style={styles.total}>
              Value: Rs. {(invoice.totalBookValue || 0).toFixed(2)}
            </Text>
            <Text style={styles.dateBook}>Date: {invoice.dateBook}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F4F6F8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1F2937',
  },
  dateButton: {
    backgroundColor: '#E0F2FE',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 16,
    color: '#1D4ED8',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  subTitle: {
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 5,
  },
  summaryBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  summaryDetailText: {
    fontSize: 15,
    paddingLeft: 15,
    color: '#374151',
  },
  noData: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  invoiceBox: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  total: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#16A34A',
    textAlign: 'right',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  detailValue: { fontWeight: '600' },
  dateBook: {
    textAlign: 'right',
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
});

export default InvoiceSummaryByDateScreen;
