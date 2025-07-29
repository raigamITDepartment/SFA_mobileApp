import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Platform,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/AuthNavigator';

// Define types
interface Item {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  goodReturnQty: number;
  goodReturnFreeQty: number;
  marketReturnQty: number;
  marketReturnFreeQty: number;
  freeIssue: number;
  lineTotal: number;
}

interface Invoice {
  id: string;
  customer: string;
  date: string;
  items: Item[];
}

// Sample data
const sampleInvoices: Invoice[] = [
  {
    id: 'INV001',
    customer: 'Pathirana Super City',
    date: '2025-07-18',
    items: [
      {
        id: '1',
        name: 'Salt',
        category: 'Spices',
        quantity: 2,
        price: 100,
        goodReturnQty: 1,
        goodReturnFreeQty: 0,
        marketReturnQty: 1,
        marketReturnFreeQty: 0,
        freeIssue: 2,
        lineTotal: 200,
      },
      {
        id: '2',
        name: 'Juice Powder',
        category: 'Beverages',
        quantity: 1,
        price: 300,
        goodReturnQty: 2,
        goodReturnFreeQty: 0,
        marketReturnQty: 0,
        marketReturnFreeQty: 0,
        freeIssue: 6,
        lineTotal: 300,
      },
    ],
  },
  {
    id: 'INV002',
    customer: 'Super K',
    date: '2025-07-19',
    items: [
      {
        id: '3',
        name: 'Soya',
        category: 'Food',
        quantity: 3,
        price: 150,
        goodReturnQty: 1,
        goodReturnFreeQty: 0,
        marketReturnQty: 0,
        marketReturnFreeQty: 0,
        freeIssue: 1,
        lineTotal: 450,
      },
    ],
  },
];

type InvoiceEditScreenProps = NativeStackScreenProps<RootStackParamList, 'InvoiceEditScreen'>;

const InvoiceEditScreen = ({ navigation }: InvoiceEditScreenProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchInvoice, setSearchInvoice] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleSearch = () => {
    const trimmedSearch = searchInvoice.trim().toLowerCase();
    let filtered: Invoice[];

    if (trimmedSearch) {
      filtered = sampleInvoices.filter((inv) =>
        inv.id.toLowerCase().includes(trimmedSearch)
      );
    } else {
      const dateStr = selectedDate.toISOString().split('T')[0];
      filtered = sampleInvoices.filter((inv) => inv.date === dateStr);
    }
    setFilteredInvoices(filtered);
    setSelectedInvoice(null);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleItemChange = (index: number, key: keyof Item, value: string) => {
    if (!selectedInvoice) return;

    const updatedItems = [...selectedInvoice.items];
    const numericValue = parseFloat(value);
    updatedItems[index] = {
      ...updatedItems[index],
      [key]: isNaN(numericValue) ? 0 : numericValue,
    };

    // Recalculate line total
    const item = updatedItems[index];
    item.lineTotal = item.quantity * item.price;

    setSelectedInvoice({ ...selectedInvoice, items: updatedItems });
  };

  const handleSave = () => {
    if (selectedInvoice) {
      const subtotal = selectedInvoice.items.reduce((sum, item) => sum + item.lineTotal, 0);

      const invoiceDataForFinish = {
        customerName: selectedInvoice.customer,
        invoiceType: 'Edited Invoice',
        invoiceMode: 'N/A',
        items: selectedInvoice.items.map(item => ({
          category: item.category,
          itemName: item.name,
          unitPrice: item.price.toString(),
          quantity: item.quantity.toString(),
          specialDiscount: '0',
          freeIssue: item.freeIssue.toString(),
          goodReturnQty: item.goodReturnQty.toString(),
          goodReturnFreeQty: item.goodReturnFreeQty.toString(),
          marketReturnQty: item.marketReturnQty.toString(),
          marketReturnFreeQty: item.marketReturnFreeQty.toString(),
          lineTotal: item.lineTotal.toFixed(2),
        })),
        invoiceSubtotal: subtotal,
        billDiscount: 0,
        billDiscountValue: 0,
        invoiceNetValue: subtotal,
        totalFreeIssue: selectedInvoice.items.reduce((sum, item) => sum + item.freeIssue, 0),
        totalGoodReturns: selectedInvoice.items.reduce((sum, item) => sum + item.goodReturnQty, 0),
        totalMarketReturns: selectedInvoice.items.reduce((sum, item) => sum + item.marketReturnQty, 0),
        invoiceDate: new Date(selectedInvoice.date).toISOString(),
      };

      navigation.navigate('InvoiceItemEditScreen', { invoiceData: invoiceDataForFinish });
      setSelectedInvoice(null);
    }
  };

  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <Text style={styles.datePickerText}>
          Select Date: {selectedDate.toDateString()}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Search Invoice Number"
        value={searchInvoice}
        onChangeText={setSearchInvoice}
      />

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search Invoices</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredInvoices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.invoiceItem}
            onPress={() => handleEditInvoice(item)}
          >
            <Text>{item.id} - {item.customer}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.noResultsText}>No invoices found.</Text>
        }
      />

      {selectedInvoice && (
        <View style={styles.editSection}>
          <Text style={styles.editTitle}>Editing Invoice: {selectedInvoice.id}</Text>

          {selectedInvoice.items.map((item, index) => (
            <View key={item.id} style={styles.itemRowContainer}>
              <Text style={styles.itemName}>
                {item.name} ({item.category})
              </Text>

              <View style={styles.itemRow}>
                <Text>Qty</Text>
                <TextInput
                  style={styles.itemInput}
                  value={item.quantity.toString()}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    handleItemChange(index, 'quantity', text)
                  }
                />

                <Text>Price</Text>
                <TextInput
                  style={styles.itemInput}
                  value={item.price.toString()}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    handleItemChange(index, 'price', text)
                  }
                />
              </View>

              <View style={styles.itemRow}>
                <Text>GR Qty</Text>
                <TextInput
                  style={styles.itemInput}
                  value={item.goodReturnQty.toString()}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    handleItemChange(index, 'goodReturnQty', text)
                  }
                />

                <Text>GR Free</Text>
                <TextInput
                  style={styles.itemInput}
                  value={item.goodReturnFreeQty.toString()}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    handleItemChange(index, 'goodReturnFreeQty', text)
                  }
                />
              </View>

              <View style={styles.itemRow}>
                <Text>MR Qty</Text>
                <TextInput
                  style={styles.itemInput}
                  value={item.marketReturnQty.toString()}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    handleItemChange(index, 'marketReturnQty', text)
                  }
                />

                <Text>MR Free</Text>
                <TextInput
                  style={styles.itemInput}
                  value={item.marketReturnFreeQty.toString()}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    handleItemChange(index, 'marketReturnFreeQty', text)
                  }
                />
              </View>

              <View style={styles.itemRow}>
                <Text>Free Issue</Text>
                <TextInput
                  style={styles.itemInput}
                  value={item.freeIssue.toString()}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    handleItemChange(index, 'freeIssue', text)
                  }
                />
              </View>

              <Text style={styles.lineTotalText}>
                Line Total: Rs. {item.lineTotal.toFixed(2)}
              </Text>
            </View>
          ))}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80,
  },
  datePickerText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#007bff',
  },
  input: {
    padding: 10,
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
  },
  searchButton: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  invoiceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'grey',
    fontSize: 16,
  },
  editSection: {
    marginTop: 20,
  },
  editTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemRowContainer: {
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  itemInput: {
    borderWidth: 1,
    width: 70,
    padding: 5,
    borderRadius: 4,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  lineTotalText: {
    marginTop: 6,
    fontWeight: 'bold',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default InvoiceEditScreen;
