import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'InvoiceItemEditScreen'>;

const InvoiceItemEditScreen = ({ navigation, route }: Props): React.JSX.Element => {
  const { invoiceData } = route.params;

  const [items, setItems] = useState(invoiceData.items);
  const [billDiscount, setBillDiscount] = useState('0');
  const [invoiceSubtotal, setInvoiceSubtotal] = useState(parseFloat(invoiceData.invoiceSubtotal.toString()));
  const [billDiscountValue, setBillDiscountValue] = useState(0);
  const [invoiceNetValue, setInvoiceNetValue] = useState(parseFloat(invoiceData.invoiceNetValue.toString()));

  const handleAddItem = () => {
    const newItem = {
      category: '',
      itemName: '',
      unitPrice: '0',
      quantity: '0',
      specialDiscount: '0',
      freeIssue: '0',
      goodReturnQty: '0',
      goodReturnFreeQty: '0',
      marketReturnQty: '0',
      marketReturnFreeQty: '0',
      lineTotal: '0',
    };
    const updated = [...items, newItem];
    setItems(updated);
    recalculateTotals(updated);
  };

  const handleItemChange = (index: number, key: keyof typeof items[0], value: string) => {
    const updated = [...items];
    updated[index][key] = value;

    const qty = parseFloat(updated[index].quantity) || 0;
    const price = parseFloat(updated[index].unitPrice) || 0;
    updated[index].lineTotal = (qty * price).toFixed(2);

    setItems(updated);
    recalculateTotals(updated);
  };

  const recalculateTotals = (updatedItems: typeof items) => {
    const subtotal = updatedItems.reduce(
      (sum, item) => sum + parseFloat(item.lineTotal || '0'),
      0
    );
    const discountPercent = parseFloat(billDiscount) || 0;
    const discountValue = (subtotal * discountPercent) / 100;
    const netValue = subtotal - discountValue;

    setInvoiceSubtotal(subtotal);
    setBillDiscountValue(discountValue);
    setInvoiceNetValue(netValue);
  };

  useEffect(() => {
    recalculateTotals(items);
  }, [billDiscount]);

  const handleSave = () => {
    Alert.alert('Success', 'Invoice saved successfully.');
    // Post to API or navigate back if needed
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer: {invoiceData.customerName}</Text>

      <FlatList
        data={items}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.itemBox}>
            <TextInput
              style={styles.input}
              placeholder="Category"
              value={item.category}
              onChangeText={(text) => handleItemChange(index, 'category', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Item Name"
              value={item.itemName}
              onChangeText={(text) => handleItemChange(index, 'itemName', text)}
            />
            <View style={styles.row}>
              <Text>Qty</Text>
              <TextInput
                style={styles.inputSmall}
                keyboardType="numeric"
                value={item.quantity}
                onChangeText={(text) => handleItemChange(index, 'quantity', text)}
              />
              <Text>Price</Text>
              <TextInput
                style={styles.inputSmall}
                keyboardType="numeric"
                value={item.unitPrice}
                onChangeText={(text) => handleItemChange(index, 'unitPrice', text)}
              />
            </View>

            <View style={styles.row}>
              <Text>Free Issue</Text>
              <TextInput
                style={styles.inputSmall}
                keyboardType="numeric"
                value={item.freeIssue}
                onChangeText={(text) => handleItemChange(index, 'freeIssue', text)}
              />
              <Text>GR Qty</Text>
              <TextInput
                style={styles.inputSmall}
                keyboardType="numeric"
                value={item.goodReturnQty}
                onChangeText={(text) => handleItemChange(index, 'goodReturnQty', text)}
              />
              <Text>GR Free</Text>
              <TextInput
                style={styles.inputSmall}
                keyboardType="numeric"
                value={item.goodReturnFreeQty}
                onChangeText={(text) => handleItemChange(index, 'goodReturnFreeQty', text)}
              />
            </View>

            <View style={styles.row}>
              <Text>MR Qty</Text>
              <TextInput
                style={styles.inputSmall}
                keyboardType="numeric"
                value={item.marketReturnQty}
                onChangeText={(text) => handleItemChange(index, 'marketReturnQty', text)}
              />
              <Text>MR Free</Text>
              <TextInput
                style={styles.inputSmall}
                keyboardType="numeric"
                value={item.marketReturnFreeQty}
                onChangeText={(text) => handleItemChange(index, 'marketReturnFreeQty', text)}
              />
            </View>

            <Text style={styles.lineTotal}>Line Total: Rs. {item.lineTotal}</Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
        <Text style={styles.addButtonText}>+ Add Item</Text>
      </TouchableOpacity>

      <View style={styles.invoiceBox}>
        <Text style={styles.invoiceTitle}>Invoice Details</Text>

        <Text style={styles.invoiceRow}>
          Invoice Subtotal : <Text style={styles.bold}>Rs. {invoiceSubtotal.toFixed(2)}</Text>
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
          Bill Discount Value : <Text style={styles.bold}>Rs. {billDiscountValue.toFixed(2)}</Text>
        </Text>

        <Text style={styles.invoiceRow}>
          Invoice Net Value : <Text style={styles.bold}>Rs. {invoiceNetValue.toFixed(2)}</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Invoice</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  itemBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  inputSmall: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 4,
    padding: 5,
    width: 60,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  lineTotal: {
    fontWeight: 'bold',
    marginTop: 6,
  },
  addButton: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#4caf50',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  invoiceBox: {
    marginTop: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  invoiceRow: {
    fontSize: 14,
    marginVertical: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
    marginVertical: 4,
  },
  discountInput: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    padding: 6,
    width: 60,
    backgroundColor: '#fff',
    textAlign: 'center',
  },
});

export default InvoiceItemEditScreen;
