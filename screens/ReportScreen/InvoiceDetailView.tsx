import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/Hooks';
import { fetchInvoiceDetailsById } from '../../actions/ReportAction';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AuthNavigator';

type InvoiceDetailViewProps = NativeStackScreenProps<RootStackParamList, 'InvoiceDetailView'>;

const InvoiceDetailView = ({ route }: InvoiceDetailViewProps) => {
  const { invoiceId } = route.params;
  const dispatch = useAppDispatch();

  const { details: invoiceDetails, loading, error } = useAppSelector(
    (state) => state.invoiceDetails
  );

  useEffect(() => {
    if (invoiceId) {
      dispatch(fetchInvoiceDetailsById(invoiceId));
    }
  }, [dispatch, invoiceId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error || !invoiceDetails) {
    return (
      <View style={styles.centered}>
        <Text>Error loading invoice details.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.itemCard}>
      <Text style={styles.itemName}>{item.itemName}</Text>
      <View style={styles.itemDetailsRow}>
        <Text>Qty: {item.totalBookQty}</Text>
        <Text>Unit Price: Rs. {item.sellUnitPrice.toFixed(2)}</Text>
      </View>
      <Text style={styles.itemTotal}>Line Total: Rs. {item.totalBookSellValue.toFixed(2)}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Invoice Details</Text>
        <Text style={styles.detailText}>Invoice No: {invoiceDetails.invoiceNo}</Text>
        <Text style={styles.detailText}>Customer: {invoiceDetails.outletName}</Text>
        <Text style={styles.detailText}>Date: {new Date(invoiceDetails.dateActual).toLocaleDateString()}</Text>
        <Text style={styles.totalText}>
          Total Value: Rs. {invoiceDetails.totalActualValue.toFixed(2)}
        </Text>
      </View>

      <Text style={styles.subHeader}>Items</Text>
      <FlatList
        data={invoiceDetails.invoiceDetailDTOList}
        renderItem={renderItem}
        keyExtractor={(item) => item.itemId.toString()}
        scrollEnabled={false} // To let the ScrollView handle scrolling
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f6f8',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 6,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#4caf50',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  itemTotal: {
    textAlign: 'right',
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default InvoiceDetailView;