import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,StatusBar
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
//import { RootStackParamList } from '@/navigation/AuthNavigator';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
type RootStackParamList = {
  // Survey: undefined;
  // HomeSurvey:undefined
  // Home: undefined;
  HomeScreen:undefined
  CreateInvoice:undefined
  CreateInvoiceScreen:undefined

};


type CreateInvoiceProps = NativeStackScreenProps<RootStackParamList, 'CreateInvoice'>;

const CreateInvoice = ({ navigation }: CreateInvoiceProps): React.JSX.Element => {
  const [selectedRoute, setSelectedRoute] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [invoiceType, setInvoiceType] = useState('');

  return (

      <LinearGradient colors={['#ff6666', '#ff0000']} style={styles.container}>

      <View style={styles.header}>
            <Ionicons name="arrow-back-outline" size={28} color="white" 
            
            onPress={() => navigation.navigate('HomeScreen')}
            
            />
            <Text style={styles.title}>Raigam SFA Invoice</Text>
            <Ionicons name="notifications-outline" size={28} color="white" />
          </View>

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Date / Time</Text>
          <TextInput
            style={styles.input}
            value="21 Nov 2024 15:00:00"
            editable={false}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Route</Text>
          <Picker
            selectedValue={selectedRoute}
            onValueChange={(itemValue) => setSelectedRoute(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Route" value="" />
            <Picker.Item label="Route 1" value="route1" />
            <Picker.Item label="Route 2" value="route2" />
          </Picker>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Customer</Text>
          <Picker
            selectedValue={selectedCustomer}
            onValueChange={(itemValue) => setSelectedCustomer(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Customer" value="" />
            <Picker.Item label="Customer A" value="customerA" />
            <Picker.Item label="Customer B" value="customerB" />
          </Picker>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Invoice Type</Text>
          <Picker
            selectedValue={invoiceType}
            onValueChange={(itemValue) => setInvoiceType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Type" value="" />
            <Picker.Item label="Type 1" value="type1" />
            <Picker.Item label="Type 2" value="type2" />
          </Picker>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.button, styles.unproductiveButton]}>
            <Text style={styles.buttonText}>Unproductive Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.createButton]}
            onPress={() => {
              console.log("Navigating to CreateInvoiceScreen");
              navigation.navigate('CreateInvoiceScreen');
            }}
          >
            <Text style={styles.buttonText}>Create Invoice</Text>
          </TouchableOpacity>
        </View>
      </View>
   
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C056D',
    padding: 20,
  },
   header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop:30

  },
  backButtonContainer: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  backText: {
    color: '#fafafa',
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  form: {
    backgroundColor: '#ffe6e6',
    borderRadius: 10,
    padding: 20,
    marginTop:15
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  picker: {
    height: 50,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  unproductiveButton: {
    backgroundColor: '#f57c00',
  },
  createButton: {
    backgroundColor: '#4caf50',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CreateInvoice;
