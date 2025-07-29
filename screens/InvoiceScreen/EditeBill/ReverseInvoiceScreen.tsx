import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/AuthNavigator';

interface Invoice {
  id: string;
  number: string;
}



type Props = NativeStackScreenProps<RootStackParamList, 'ReverseInvoiceScreen'>;

const ReverseInvoiceScreen = ({ navigation, route }: Props): React.JSX.Element => {
  const [invoiceList, setInvoiceList] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<string>('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate fetch - Replace this with API call
    const fetchInvoices = async () => {
      const mockData = [
        { id: '1', number: 'INV-1001' },
        { id: '2', number: 'INV-1002' },
        { id: '3', number: 'INV-1003' },
      ];
      setInvoiceList(mockData);
    };

    fetchInvoices();
  }, []);

  const handleReverse = async () => {
    if (!selectedInvoice || !reason.trim()) {
      Alert.alert('Validation Error', 'Please select an invoice and enter a reason.');
      return;
    }

    try {
      setLoading(true);

      // TODO: Replace with real API call
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Success', `Invoice ${selectedInvoice} reversed successfully.`);
        setSelectedInvoice('');
        setReason('');
        navigation.navigate('HomeInvoice');
      }, 1500);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to reverse invoice.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Select Invoice Number</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedInvoice}
          onValueChange={(itemValue) => setSelectedInvoice(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Choose an invoice" value="" />
          {invoiceList.map((inv) => (
            <Picker.Item key={inv.id} label={inv.number} value={inv.id} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Reverse Reason</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter reason"
        multiline
        numberOfLines={4}
        value={reason}
        onChangeText={setReason}
      />

      <TouchableOpacity style={styles.button} onPress={handleReverse} disabled={loading}
      
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Submit Reverse Request</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ReverseInvoiceScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
    backgroundColor: '#fafafa',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fafafa',
  },
  picker: {},
  button: {
    marginTop: 30,
    backgroundColor: '#3B82F6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
