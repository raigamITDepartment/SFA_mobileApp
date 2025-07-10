// File: CreateInvoiceScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AuthNavigator';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const testItemNames = [
  'Dazzling Face Wash 90ml Assorted Pack',
  'Deveni Batha Kotthu Mix White',
  'Nenaposha 80g',
  'Nenaposha 200g',
  'Aarya easy',
  'Dazzling Face Wash 90ml Assorted Pack',
  'Deveni Batha Kotthu Mix White',
  'Nenaposha 80g',
  'Nenaposha 200g',
  'Aarya easy',
];

type CreateInvoiceScreenProps = NativeStackScreenProps<RootStackParamList, 'CreateInvoiceScreen'>;

const CreateInvoiceScreen = ({ navigation, route }: CreateInvoiceScreenProps): React.JSX.Element => {
  const [billDiscount, setBillDiscount] = useState<string>('0');
  const [savedItems, setSavedItems] = useState<any[]>([]);

  const {
    customerId,
    customerName = 'No Customer',
    invoiceType = 'N/A',
    invoiceMode = 'N/A',
  } = route.params || {};

  useFocusEffect(
    React.useCallback(() => {
      const loadItems = async () => {
        try {
          const keys = await AsyncStorage.getAllKeys();
          const itemKeys = keys.filter(k => k.startsWith('item_'));
          const entries = await AsyncStorage.multiGet(itemKeys);
          const items = entries.map(([_, value]) => JSON.parse(value || '{}'));

          // Add test items that don't already exist in AsyncStorage
          const existingItemNames = new Set(items.map(i => i.itemName));
          const testItems = testItemNames.filter(name => !existingItemNames.has(name)).map(name => ({
            itemName: name,
            quantity: '0',
            goodReturnFreeQty: '0',
            marketReturnFreeQty: '0',
            freeIssue: '0',
            lineTotal: '0.00',
          }));

          setSavedItems([...items, ...testItems]);
        } catch (e) {
          console.error('Error loading saved items:', e);
        }
      };

      loadItems();
    }, [])
  );

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.itemBox}
      onPress={() => {
        navigation.navigate('ItemDetailsScreen', { customerName, itemName: item.itemName });
      }}
    >
      <Text style={styles.itemTitle}>{item.itemName}</Text>
      <View style={styles.row}>
        <Text style={styles.unitText}>Pkt</Text>
        <TextInput value={item.quantity} editable={false} style={styles.inputBox} />
        <TextInput value={item.goodReturnFreeQty} editable={false} style={styles.inputBox} />
        <TextInput value={item.marketReturnFreeQty} editable={false} style={styles.inputBox} />
        <TextInput value={item.freeIssue} editable={false} style={styles.inputBox} />
      </View>
      <Text style={{ fontWeight: 'bold' }}>Line Total: Rs. {item.lineTotal}</Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#ff6666', '#ff0000']} style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.headerBar}>
          <Text style={styles.headerText}>{customerName}</Text>
          <Text style={styles.subHeaderText}>{`Type: ${invoiceType} | Mode: ${invoiceMode}`}</Text>
        </View>

        <TextInput placeholder="Search for items" style={styles.searchBar} />

        <View style={styles.tableHeader}>
          {['Unit', 'Qty', 'GR', 'MR', 'Free'].map((text, idx) => (
            <Text key={idx} style={styles.headerCell}>{text}</Text>
          ))}
        </View>

        <FlatList
          data={savedItems}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        />

        <View style={styles.invoiceBox}>
          <Text style={styles.invoiceTitle}>Invoice Details</Text>
          <Text style={styles.invoiceRow}>
            Invoice Subtotal : <Text style={styles.bold}>0000.00</Text>
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
            Bill Discount Value : <Text style={styles.bold}>0</Text>
          </Text>
          <Text style={styles.invoiceRow}>
            Invoice Net Value : <Text style={styles.bold}>0000.00</Text>
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.navigate('CreateInvoice', { customerId, invoiceType, invoiceMode })}>
            <Text style={styles.buttonText}>Cancel Invoice</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.completeButton} onPress={() => navigation.navigate('InvoiceFinish')}>
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
  headerBar: { marginTop: 20, marginBottom: 10, alignItems: 'center' },
  headerText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  subHeaderText: { fontSize: 14, color: '#fff', marginTop: 4 },
  searchBar: { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8, marginBottom: 10 },
  tableHeader: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#d94e4e', paddingVertical: 5, paddingHorizontal: 5, borderRadius: 5 },
  headerCell: { fontSize: 11, color: '#fff', flex: 1, textAlign: 'center' },
  itemBox: { backgroundColor: '#eaeaea', padding: 10, marginVertical: 5, borderRadius: 10 },
  itemTitle: { fontWeight: 'bold', marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center' },
  unitText: { marginRight: 8, fontWeight: 'bold' },
  inputBox: { flex: 1, borderWidth: 1, borderColor: '#aaa', borderRadius: 5, padding: 4, marginHorizontal: 3, textAlign: 'center', backgroundColor: '#fff' },
  invoiceBox: { backgroundColor: '#eaeaea', borderRadius: 10, padding: 15, marginTop: 10 },
  invoiceTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  invoiceRow: { fontSize: 14, marginVertical: 4 },
  bold: { fontWeight: 'bold' },
  discountRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  discountInput: { borderWidth: 1, borderColor: '#aaa', borderRadius: 5, padding: 5, width: 60, backgroundColor: '#fff', marginLeft: 10, textAlign: 'center' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, marginBottom: 30 },
  cancelButton: { backgroundColor: 'orange', padding: 12, borderRadius: 10, flex: 0.48, alignItems: 'center' },
  completeButton: { backgroundColor: 'green', padding: 12, borderRadius: 10, flex: 0.48, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
