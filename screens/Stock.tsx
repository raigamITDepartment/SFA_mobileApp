import React, { useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AuthNavigator';

type StockProps = NativeStackScreenProps<RootStackParamList, 'Stock'>;

const Stock = ({ navigation }: StockProps): React.JSX.Element => {
  const [searchText, setSearchText] = useState("");
  const stockData = [
    { id: "1", product: "Deveni Batha Kotthu Mix White", qty: 20, uom: "Pkt" },
    { id: "2", product: "Deveni Batha Kotthu Mix White", qty: 30, uom: "Pkt" },
    { id: "3", product: "Deveni Batha Kotthu Mix White", qty: 50, uom: "Pkt" },
    { id: "4", product: "Deveni Batha Kotthu Mix White", qty: 60, uom: "Pkt" },
    { id: "5", product: "Deveni Batha Kotthu Mix White", qty: 20, uom: "Pkt" },
  ];

  const filteredData = stockData.filter(item =>
    item.product.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>{item.product}</Text>
      <View style={styles.row}>
        <Text style={styles.cardText}>Qty: {item.qty}</Text>
        <Text style={styles.cardText}>UOM: {item.uom}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>


           <View style={styles.backButtonContainer}>
          <TouchableOpacity activeOpacity={1} 
          
            onPress={() => {
            console.log("Navigating to Home");
            navigation.navigate('start');
            }
            }
            >
              
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.logo}>Raigam</Text>
        <TouchableOpacity>
          <MaterialIcons name="notifications" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Stock Level</Text>

      <View style={styles.searchBar}>
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
        />
        <MaterialIcons name="search" size={24} color="black" style={styles.searchIcon} />
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.tableHeaderText}>Product</Text>
        <Text style={styles.tableHeaderText}>Qty</Text>
        <Text style={styles.tableHeaderText}>UOM</Text>
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffcccc",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#d60000",
    padding: 8,
    borderRadius: 8,
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 40,
  },
  searchIcon: {
    marginLeft: 8,
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f2f2f2",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  tableHeaderText: {
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

 backButtonContainer: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backText: {
    color: '#fafafa',
    fontSize: 18,
  },


});

export default Stock;
