import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
//import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
//import { RootStackParamList } from "@/navigation/AuthNavigator";
// Define navigation types



type RootStackParamList = {
  InvoiceSummary: undefined;
  ProductiveCalls: undefined;
  TotalSales: undefined;
  StockLevel: undefined;
  PromoTarget: undefined;
  HomeScreen:undefined;
  HomeReport: undefined;
  ProductReport:undefined;
};



type HomeReportProps = NativeStackScreenProps<RootStackParamList, "HomeReport">;

const HomeReport = ({ navigation }: HomeReportProps): React.JSX.Element => {
  const reports = [
    { title: 'Invoice Summary Report', route: 'InvoiceSummary' },
    { title: 'Product Report', route: 'ProductReport' },
    { title: 'Stock Level Report', route: 'StockLevel' },
    { title: 'Promo Target VS Achievement', route: 'PromoTarget' },
    
  ];

  return (
    <LinearGradient colors={['#ff6666', '#ff0000']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Ionicons name="arrow-back-outline" size={28} color="white" 
          onPress={() => navigation.navigate('HomeScreen')}
        />
        <Text style={styles.title}>Raigam SFA Report</Text>
        <Ionicons name="notifications-outline" size={28} color="white" />
      </View>
      <View style={styles.content}>
        {reports.map((report, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => navigation.navigate(report.route as "InvoiceSummary" | "ProductReport"  | "StockLevel" | "PromoTarget")}
          >
            <Text style={styles.buttonText}>{report.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#cc0000',
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HomeReport;
