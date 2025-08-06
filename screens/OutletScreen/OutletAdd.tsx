import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  
} from 'react-native';
import { Text, Card} from "react-native-paper";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AuthNavigator';


type StockProps = NativeStackScreenProps<RootStackParamList, 'OutletAdd'>;



const OutletAdd = ({ navigation }: StockProps): React.JSX.Element => {


  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [route, setRoute] = useState('');
  const [outlet, setOutlet] = useState('');
  const [outletName, setOutletName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [address3, setAddress3] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [mobile, setMobile] = useState('');
  const [category, setCategory] = useState('');

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleCreateOutlet = () => {
    // Submit outlet creation logic
    console.log({
      date,
      route,
      outlet,
      outletName,
      address1,
      address2,
      address3,
      contactPerson,
      mobile,
      category,
    });
  };

  return (
    <LinearGradient colors={['#ff6666', '#ff0000']} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
        <Text style={styles.title}>Add New Outlet</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Date / Time</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
            <Text style={styles.dateText}>
              {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Route</Text>
          <Picker
            selectedValue={route}
            onValueChange={(itemValue) => setRoute(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Route" value="" />
            <Picker.Item label="Route 1" value="route1" />
            <Picker.Item label="Route 2" value="route2" />
          </Picker>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Add After</Text>
          <Picker
            selectedValue={outlet}
            onValueChange={(itemValue) => setOutlet(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Outlet" value="" />
            <Picker.Item label="Outlet 1" value="outlet1" />
            <Picker.Item label="Outlet 2" value="outlet2" />
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Enter Outlet Name"
          value={outletName}
          onChangeText={setOutletName}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Address 1"
          value={address1}
          onChangeText={setAddress1}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Address 2"
          value={address2}
          onChangeText={setAddress2}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Address 3"
          value={address3}
          onChangeText={setAddress3}
        />
        <TextInput
          style={styles.input}
          placeholder="Contact Person Name"
          value={contactPerson}
          onChangeText={setContactPerson}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Mobile No."
          value={mobile}
          keyboardType="phone-pad"
          onChangeText={setMobile}
        />

        <View style={styles.field}>
          <Text style={styles.label}>Shop Category</Text>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Category" value="" />
            <Picker.Item label="Category 1" value="category1" />
            <Picker.Item label="Category 2" value="category2" />
          </Picker>

      
        </View>
        

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCreateOutlet} style={styles.createButton}>
            <Text style={styles.createText}>Create</Text>
          </TouchableOpacity>
        </View>
        </Card>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 16,
  
    textAlign: 'center',
  },
  field: {
    marginBottom: 16,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,

  },
  input: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFF',
     color: '#555',
  },
  picker: {

    borderColor: '#CCC',
    borderRadius: 20,
    backgroundColor: '#FFF',
   
  },
  datePicker: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  dateText: {
    fontSize: 16,
    color: '#555',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    padding: 12,
    backgroundColor: '#E57373',
    alignItems: 'center',
    borderRadius: 8,
  },
  cancelText: {
    color: '#FFF',
    fontWeight: '600',
  },
  createButton: {
    flex: 1,
    marginLeft: 8,
    padding: 12,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    borderRadius: 8,
  },
  createText: {
    color: '#FFF',
    fontWeight: '600',
  },
   card: {
    padding: 16,
    borderRadius: 8,
    marginTop: 35,
  },


});

export default OutletAdd;
