import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  InvoiceSummary: undefined;
  ProductiveCalls: undefined;
  TotalSales: undefined;
  TotalPC: undefined;
  StockLevel: undefined;
  PromoTarget: undefined;
  TargetAchievement: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList>;

const ReportScreen: React.FC<Props> = ({ route }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{route.name} Page</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ReportScreen;
