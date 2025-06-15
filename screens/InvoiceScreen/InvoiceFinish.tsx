import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AuthNavigator';

type InvoiceFinishProps = NativeStackScreenProps<RootStackParamList, 'InvoiceFinish'>;

const InvoiceFinish = ({ navigation }: InvoiceFinishProps): React.JSX.Element => {
  return (
    <View style={styles.container}>
      {/* Header */}
    <View style={styles.header}>
            <Ionicons name="arrow-back-outline" size={28} color="white" 
            
            onPress={() => navigation.navigate('Home')}
            
            />
            <Text style={styles.title}>Raigam</Text>
            <Ionicons name="notifications-outline" size={28} color="white" />
          </View>

      {/* Invoice Content */}
      <ScrollView style={styles.invoiceContainer}>
        <Text style={styles.invoiceHeader}>Test Agency\Test</Text>
        <Text style={styles.subHeader}>Test1</Text>
        <Text style={styles.subHeader}>0000000000</Text>

        <View style={styles.section}>
          <Text style={styles.boldText}>Sales Rep</Text>
          <Text style={styles.boldText}>Territory</Text>
        </View>

        <View style={styles.section}>
          <Text>Invoice No: CN0999684</Text>
          <Text>Dealer Code: 0999/1118</Text>
          <Text>Outlet: ACB Mart</Text>
          <Text>Outlet Address: A, hi, hyj</Text>
          <Text>Outlet Contact: ABC</Text>
          <Text>Date: 25/11/2024</Text>
          <Text>Time: 12:42:46 pm</Text>
        </View>

        {/* Invoice Table */}
        <View style={styles.table}>
          <Text style={styles.tableHeader}>
            Item | Qty | Rate | Disc. % | Val.(Rs)
          </Text>
          <Text style={styles.tableRow}>
            Ravan Black Hair Col Shmpo 10ml Sachet / Pk | 2.0 | 77.95 | 0.00 | 155.9
          </Text>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text>Gross: Rs. 155.90</Text>
          <Text>Line Discount: Rs. 0.00</Text>
          <Text>Special Discount: Rs. 0.00</Text>
          <Text>Bill Discount (0.0%): Rs. 0.00</Text>
          <Text>Total Discount: Rs. 0.00</Text>
          <Text>Good Ret.: Rs. 0.00</Text>
          <Text>Market Ret.: Rs. 0.00</Text>
          <Text>Net Value: Rs. 155.90</Text>
        </View>

        <Text style={styles.centerText}>Customer Seal and Signature</Text>
        <Text style={styles.centerText}>---END---</Text>
        <Text style={styles.centerText}>Solution by Raigam IT</Text>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Print</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}
        
         onPress={() => {
            console.log("Navigating to Home");
            navigation.navigate('Home');
          }}
        >
          <Text style={styles.buttonText}>Sync & Finish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ff6767',
    padding: 10,
  },
  menuIcon: {
    fontSize: 20,
    color: '#fff',
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  notificationIcon: {
    fontSize: 20,
    color: '#fff',
  },
  invoiceContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  invoiceHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
  section: {
    marginVertical: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  table: {
    marginVertical: 10,
  },
  tableHeader: {
    fontWeight: 'bold',
  },
  tableRow: {
    marginVertical: 5,
  },
  centerText: {
    textAlign: 'center',
    marginVertical: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  button: {
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 8,
    width: '40%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

    title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default InvoiceFinish;
