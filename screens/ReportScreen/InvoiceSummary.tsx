import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Platform,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

type InvoiceItem = {
  itemName: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

type Invoice = {
  date: string;
  shopCode: string;
  customerName: string;
  invoiceType: string;
  invoiceMode: string;
  items: InvoiceItem[];
  invoiceSubtotal: number;
  billDiscount: number;
  billDiscountValue: number;
  invoiceNetValue: number;
};

const InvoiceSummaryByDateScreen = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    saveSampleData(); // 👈 Load sample data first (remove this line in production)
    fetchInvoices();
  }, []);

  const saveSampleData = async () => {
    const sampleInvoices: Invoice[] = [

      {
        date: '2025-07-12',
        shopCode: 'SK001',
        customerName: 'Super K',
        invoiceType: 'Retail',
        invoiceMode: 'Cash',
        items: [
          {
            itemName: 'Dazzling Face Wash 90ml',
            quantity: 2,
            unitPrice: 500,
            total: 100,
          },
          {
            itemName: 'Nenaposha 80g',
            quantity: 1,
            unitPrice: 250,
            total: 250,
          },
        ],
        invoiceSubtotal: 3250,
        billDiscount: 10,
        billDiscountValue: 125,
        invoiceNetValue: 2125,
      },
      {
        date: '2025-07-12',
        shopCode: 'JD001',
        customerName: 'John Doe',
        invoiceType: 'Retail',
        invoiceMode: 'Cash',
        items: [
          {
            itemName: 'Dazzling Face Wash 90ml',
            quantity: 2,
            unitPrice: 500,
            total: 1000,
          },
          {
            itemName: 'Nenaposha 80g',
            quantity: 1,
            unitPrice: 250,
            total: 250,
          },
        ],
        invoiceSubtotal: 1250,
        billDiscount: 10,
        billDiscountValue: 125,
        invoiceNetValue: 1125,
      },
      {
        date: '2025-07-11',
        shopCode: 'JS001',
        customerName: 'Jane Smith',
        invoiceType: 'Wholesale',
        invoiceMode: 'Credit',
        items: [
          {
            itemName: 'Deveni Batha Kotthu Mix White',
            quantity: 5,
            unitPrice: 200,
            total: 1000,
          },
        ],
        invoiceSubtotal: 1000,
        billDiscount: 5,
        billDiscountValue: 50,
        invoiceNetValue: 950,
      },
    ];

    try {
      await AsyncStorage.setItem('allInvoices', JSON.stringify(sampleInvoices));
      console.log('Sample invoices saved!');
    } catch (error) {
      console.error('Error saving sample invoices:', error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const data = await AsyncStorage.getItem('allInvoices');
      if (data !== null) {
        setInvoices(JSON.parse(data));
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    }
  };

  const handleDateChange = (_event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  };

  const filteredInvoices = invoices.filter((inv) =>
    inv.date === formatDate(selectedDate) &&
    (searchQuery === '' ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.shopCode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const { dailyTotalNet, dailyInvoiceCount } = useMemo(() => {
    return {
      dailyTotalNet: filteredInvoices.reduce((total, inv) => total + inv.invoiceNetValue, 0),
      dailyInvoiceCount: filteredInvoices.length,
    };
  }, [filteredInvoices]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Invoice Summary By Date</Text>

      <Pressable onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
        <Text style={styles.dateText}>Selected Date: {formatDate(selectedDate)}</Text>
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
        placeholder="Search by Customer Name / Code"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.summaryBox}>
        <Text style={styles.summaryText}>
          Total Productive Calls: {dailyInvoiceCount}
        </Text>
        <Text style={styles.summaryText}>
          Total UnProductive Calls: 
        </Text>
        <Text style={styles.summaryText}>Total Net Value: Rs. {dailyTotalNet.toFixed(2)}</Text>
      </View>

      {filteredInvoices.length === 0 ? (
        <Text style={styles.noData}>No invoices found for this date.</Text>
      ) : (
        filteredInvoices.map((invoice, idx) => (
          <View key={idx} style={styles.invoiceBox}>
            <Text style={styles.subTitle}>Customer: {invoice.customerName}</Text>
            <Text>Shop Code: {invoice.shopCode}</Text>
            <Text>Invoice Type: {invoice.invoiceType}</Text>
            <Text>Mode: {invoice.invoiceMode}</Text>

            {invoice.items.map((item, i) => (
              <View key={i} style={styles.itemBox}>
                <Text style={styles.itemName}>{item.itemName}</Text>
                <Text>Qty: {item.quantity}</Text>
                <Text>Price: Rs. {item.unitPrice}</Text>
                <Text>Total: Rs. {item.total}</Text>
              </View>
            ))}

            <Text>Subtotal: Rs. {invoice.invoiceSubtotal}</Text>
            <Text>Discount ({invoice.billDiscount}%): Rs. {invoice.billDiscountValue}</Text>
            <Text style={styles.total}>Net: Rs. {invoice.invoiceNetValue}</Text>
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
  itemBox: {
    marginTop: 10,
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 6,
  },
  itemName: {
    fontWeight: '600',
  },
  total: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#16A34A',
  },
});

export default InvoiceSummaryByDateScreen;
