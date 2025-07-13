import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput
} from 'react-native';

// Define the item type
type StockItem = {
  itemCode: string;
  itemName: string;
  unit: string;
  availableQty: number;
  lastUpdated: string;
};

const sampleStockData: StockItem[] = [
  {
    itemCode: 'ITEM001',
    itemName: 'Dazzling Face Wash 90ml',
    unit: 'pcs',
    availableQty: 120,
    lastUpdated: '2025-07-10',
  },
  {
    itemCode: 'ITEM002',
    itemName: 'Deveni Batha Kotthu Mix White',
    unit: 'kg',
    availableQty: 54,
    lastUpdated: '2025-07-11',
  },
  {
    itemCode: 'ITEM003',
    itemName: 'Nenaposha 80g',
    unit: 'pcs',
    availableQty: 200,
    lastUpdated: '2025-07-12',
  },
  {
    itemCode: 'ITEM004',
    itemName: 'Aarya Easy Pack',
    unit: 'pcs',
    availableQty: 80,
    lastUpdated: '2025-07-10',
  },
];

const StockLevelReportScreen = () => {
  const [stockData, setStockData] = useState<StockItem[]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    // Simulating fetch
    setStockData(sampleStockData);
  }, []);

  const filteredData = stockData.filter(item =>
    item.itemName.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }: { item: StockItem }) => (
    <View style={styles.card}>
      <Text style={styles.itemName}>{item.itemName}</Text>
      <Text style={styles.text}>Item Code: {item.itemCode}</Text>
      <Text style={styles.text}>Available: {item.availableQty} {item.unit}</Text>
      <Text style={styles.text}>Last Updated: {item.lastUpdated}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Stock Level Report (Item-wise)</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by item name..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.itemCode}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

export default StockLevelReportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    paddingTop: StatusBar.currentHeight || 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: '#555',
  },
});
