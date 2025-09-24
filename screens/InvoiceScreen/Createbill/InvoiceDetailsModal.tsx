import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAppSelector } from '../../../store/Hooks';

interface InvoiceDetailsModalProps {
  visible: boolean;
  onClose: () => void;
}

const InvoiceDetailsModal = ({
  visible,
  onClose,
}: InvoiceDetailsModalProps) => {
  const { invoice, loading, error } = useAppSelector(
    (state) => state.invoiceDetails
  );

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#1D4ED8" />;
    }

    if (error || !invoice) {
      return <Text>Error loading details or no data available.</Text>;
    }

    return (
      <ScrollView>
        <Text style={styles.modalTitle}>Invoice: {invoice.invoiceNo}</Text>
        <Text style={styles.detailText}>Outlet: {invoice.outletName}</Text>
        <Text style={styles.detailText}>
          Total Value: Rs. {invoice.totalBookValue?.toFixed(2)}
        </Text>

        <Text style={styles.itemsHeader}>Items</Text>
        {invoice.invoiceDetailDTOList?.map((item: any, index: number) => (
          <View key={index} style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.itemName}</Text>
                <Text>
              Item Price: Rs. {item.sellUnitPrice?.toFixed(2)}
            </Text>
            <Text>
              Qty: {item.totalBookQty} |  GR: {item.goodReturnTotalQty} |  MR: {item.marketReturnTotalQty}
            </Text>
            <Text>
             %: {item.discountPercentage} |   Discount Value: {item.totalDiscountValue?.toFixed(2)}
            </Text>
        
            <Text>
              Line Total: Rs. {item.sellTotalPrice?.toFixed(2)}
            </Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {renderContent()}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  itemsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  itemName: {
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#ff0000',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 15,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default InvoiceDetailsModal;