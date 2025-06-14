import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AuthNavigator';

type LabelInputProps = {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
};

const LabelInput: React.FC<LabelInputProps> = ({
  label,
  value,
  onChangeText = () => {},
  editable = true,
}) => (
  <View style={styles.labelInput}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, !editable && styles.inputDisabled]}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      keyboardType="numeric"
    />
  </View>
);

type ItemDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'ItemDetailsScreen'>;

const ItemDetailsScreen = ({ navigation }: ItemDetailsScreenProps): React.JSX.Element => {
  const [unitPrice, setUnitPrice] = useState('100.00');
  const [quantity, setQuantity] = useState('0');
  const [specialDiscount, setSpecialDiscount] = useState('0');
  const [lineDiscountPercent, setLineDiscountPercent] = useState('0');
  const [freeIssue, setFreeIssue] = useState('0');

  const [showGoodReturn, setShowGoodReturn] = useState(false);
const [showMarketReturn, setShowMarketReturn] = useState(false);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Item Stock Details</Text>
      <Text style={styles.itemName}>Item name : Nenaposha 80g</Text>
      <Text style={styles.itemCode}>Item code : 866543CF</Text>

      <View style={styles.inputGroup}>
        <LabelInput label="Available Stock" value="10000" editable={false} />
        <LabelInput label="Unit of Measure" value="Pkt" editable={false} />
        <LabelInput label="Unit Price" value={unitPrice} onChangeText={setUnitPrice} />
        <LabelInput label="Adjusted Unit Price Rs." value="100.00" editable={false} />
        <LabelInput label="Quantity" value={quantity} onChangeText={setQuantity} />
        <LabelInput
          label="Special Discount (per unit)"
          value={specialDiscount}
          onChangeText={setSpecialDiscount}
        />
        <LabelInput
          label="Line Discount %"
          value={lineDiscountPercent}
          onChangeText={setLineDiscountPercent}
        />
        <LabelInput label="Line Discount Value" value="0" editable={false} />
        <LabelInput label="Free Issue" value={freeIssue} onChangeText={setFreeIssue} />
      </View>

      {/* Accordion-like sections */}
<View style={styles.accordionSection}>
  {/* Good Return Details */}
  <TouchableOpacity
    style={styles.accordionHeader}
    onPress={() => setShowGoodReturn(!showGoodReturn)}
  >
    <Text style={styles.accordionHeaderText}>Good Return Details</Text>
    <Text style={styles.accordionArrow}>{showGoodReturn ? '▲' : '▼'}</Text>
  </TouchableOpacity>
  {showGoodReturn && (
    <View style={styles.accordionContent}>
        <LabelInput label="Unit of Measure" value="pkt" />
      <LabelInput label="Good Return Qty" value="0" />
       <LabelInput label="Good Return Price" value="0" />
      <LabelInput label="Good Return Free Qty" value="" />
    </View>
  )}

  {/* Market Return Details */}
  <TouchableOpacity
    style={styles.accordionHeader}
    onPress={() => setShowMarketReturn(!showMarketReturn)}
  >
    <Text style={styles.accordionHeaderText}>Market Return Details</Text>
    <Text style={styles.accordionArrow}>{showMarketReturn ? '▲' : '▼'}</Text>
  </TouchableOpacity>
  {showMarketReturn && (
    <View style={styles.accordionContent}>
        <LabelInput label="Unit of Measure" value="pkt" />
      <LabelInput label="Market Return Qty" value="0" />
       <LabelInput label="Market  Return Price" value="0" />
      <LabelInput label="Market Return Free Qty" value="" />
    </View>
  )}

  
</View>

      <LabelInput label="Line Total" value="0" editable={false} />

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          buttonColor="orange"
          textColor="white"
          onPress={() => console.log('Cancel')}
          style={styles.button}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          buttonColor="green"
          textColor="white"
          onPress={() => {
            console.log("Navigating to Home");
            navigation.navigate('CreateInvoiceScreen');
          }}
          style={styles.button}
        >
          Ok
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fdf1f0',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 10,
  },
  itemName: {
    color: 'red',
    fontWeight: '600',
    alignSelf: 'center',
  },
  itemCode: {
    color: '#f2d42c',
    fontWeight: '600',
    alignSelf: 'center',
    marginBottom: 10,
  },
  inputGroup: {
    marginTop: 10,
  },
  labelInput: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 6,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  inputDisabled: {
    backgroundColor: '#eee',
  },
  accordionSection: {
    marginVertical: 10,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 6,
  },
  accordionHeaderText: {
    fontWeight: '600',
    fontSize: 16,
  },
  accordionArrow: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 6,
  },

accordionContent: {
  backgroundColor: '#eee',
  padding: 10,
  borderRadius: 6,
  marginBottom: 10,
},


});

export default ItemDetailsScreen;
