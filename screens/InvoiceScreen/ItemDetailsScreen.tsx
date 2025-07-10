// File: ItemDetailsScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AuthNavigator';

type LabelInputProps = {
  label: string;
  value: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
};

const LabelInput: React.FC<LabelInputProps> = ({ label, value, onChangeText = () => {}, editable = true }) => (
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

const ItemDetailsScreen = ({ navigation, route }: ItemDetailsScreenProps): React.JSX.Element => {
  const { customerName, itemName } = route.params;

  const [unitPrice, setUnitPrice] = useState('100.00');
  const [unitPriceGR, setUnitPriceGR] = useState('0');
  const [unitPriceMR, setUnitPriceMR] = useState('0');
  const [quantity, setQuantity] = useState('0');
  const [specialDiscount, setSpecialDiscount] = useState('0');
  const [freeIssue, setFreeIssue] = useState('0');
  const [showGoodReturn, setShowGoodReturn] = useState(false);
  const [showMarketReturn, setShowMarketReturn] = useState(false);
  const [goodReturnQty, setGoodReturnQty] = useState('0');
  const [goodReturnFreeQty, setGoodReturnFreeQty] = useState('0');
  const [goodReturnTotal, setGoodReturnTotal] = useState('0');
  const [marketReturnQty, setMarketReturnQty] = useState('0');
  const [marketReturnFreeQty, setMarketReturnFreeQty] = useState('0');
  const [marketReturnTotal, setMarketReturnTotal] = useState('0');
  const [lineTotal, setLineTotal] = useState('0');

  useEffect(() => {
    const parse = (val: string) => parseFloat(val) || 0;
    const unitGR = parse(unitPriceGR);
    const unitMR = parse(unitPriceMR);
    const unit = parse(unitPrice);
    const qty = parse(quantity);
    const free = parse(freeIssue);
    const discount = parse(specialDiscount);
    const goodQty = parse(goodReturnQty);
    const goodFree = parse(goodReturnFreeQty);
    const marketQty = parse(marketReturnQty);
    const marketFree = parse(marketReturnFreeQty);

    const goodTotal = unitGR * Math.max(goodQty - goodFree, 0);
    setGoodReturnTotal(goodTotal.toFixed(2));

    const marketTotal = unitMR * Math.max(marketQty - marketFree, 0);
    setMarketReturnTotal(marketTotal.toFixed(2));

    const baseAmount = unit * Math.max(qty - free, 0);
    const discountedAmount = baseAmount * (1 - discount / 100);
    const finalTotal = discountedAmount - goodTotal - marketTotal;

    setLineTotal(finalTotal.toFixed(2));
  }, [unitPrice, quantity, freeIssue, specialDiscount, goodReturnQty, goodReturnFreeQty, marketReturnQty, marketReturnFreeQty]);

  const handleSave = async () => {
    const itemData = {
      itemName,
      unitPrice,
      quantity,
      specialDiscount,
      freeIssue,
      goodReturnQty,
      goodReturnFreeQty,
      marketReturnQty,
      marketReturnFreeQty,
      lineTotal,
    };

    try {
      await AsyncStorage.setItem(`item_${itemName}`, JSON.stringify(itemData));
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save item', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Item Stock Details</Text>
      <Text style={styles.customerName}>{customerName}</Text>
      <Text style={styles.itemName}>Item name : {itemName}</Text>
      <Text style={styles.itemCode}>Item code : 866543CF</Text>

      <View style={styles.inputGroup}>
        <LabelInput label="Available Stock" value="10000" editable={false} />
        <LabelInput label="Unit of Measure" value="Pkt" editable={false} />
        <LabelInput label="Unit Price" value={unitPrice} onChangeText={setUnitPrice} />
        <LabelInput label="Adjusted Unit Price Rs." value={unitPrice} editable={false} />
        <LabelInput label="Quantity" value={quantity} onChangeText={setQuantity} />
        <LabelInput label="Special Discount (%)" value={specialDiscount} onChangeText={setSpecialDiscount} />
        <LabelInput label="Free Issue" value={freeIssue} onChangeText={setFreeIssue} />
      </View>

      <View style={styles.accordionSection}>
        <TouchableOpacity style={styles.accordionHeader} onPress={() => setShowGoodReturn(!showGoodReturn)}>
          <Text style={styles.accordionHeaderText}>Good Return Details</Text>
          <Text style={styles.accordionArrow}>{showGoodReturn ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {showGoodReturn && (
          <View style={styles.accordionContent}>
            <LabelInput label="Unit Price GoodReturn" value={unitPriceGR} onChangeText={setUnitPriceGR} />
            <LabelInput label="Good Return Qty" value={goodReturnQty} onChangeText={setGoodReturnQty} />
            <LabelInput label="Good Return Free Qty" value={goodReturnFreeQty} onChangeText={setGoodReturnFreeQty} />
            <LabelInput label="Good Return Total" value={goodReturnTotal} editable={false} />
          </View>
        )}

        <TouchableOpacity style={styles.accordionHeader} onPress={() => setShowMarketReturn(!showMarketReturn)}>
          <Text style={styles.accordionHeaderText}>Market Return Details</Text>
          <Text style={styles.accordionArrow}>{showMarketReturn ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {showMarketReturn && (
          <View style={styles.accordionContent}>
            <LabelInput label="Unit Price MarketReturn" value={unitPriceMR} onChangeText={setUnitPriceMR} />
            <LabelInput label="Market Return Qty" value={marketReturnQty} onChangeText={setMarketReturnQty} />
            <LabelInput label="Market Return Free Qty" value={marketReturnFreeQty} onChangeText={setMarketReturnFreeQty} />
            <LabelInput label="Market Return Total" value={marketReturnTotal} editable={false} />
          </View>
        )}
      </View>

      <LabelInput label="Line Total" value={lineTotal} editable={false} />

      <View style={styles.buttonContainer}>
        <Button mode="contained" buttonColor="orange" textColor="white" onPress={() => navigation.goBack()} style={styles.button}>
          Cancel
        </Button>
        <Button mode="contained" buttonColor="green" textColor="white" onPress={handleSave} style={styles.button}>
          Ok
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fdf1f0' },
  title: { fontSize: 22, fontWeight: 'bold', alignSelf: 'center', marginVertical: 10 },
  customerName: { fontSize: 18, fontWeight: 'bold', alignSelf: 'center', marginBottom: 5 },
  itemName: { color: 'red', fontWeight: '600', alignSelf: 'center' },
  itemCode: { color: '#f2d42c', fontWeight: '600', alignSelf: 'center', marginBottom: 10 },
  inputGroup: { marginTop: 10 },
  labelInput: { marginBottom: 12 },
  label: { fontSize: 14, marginBottom: 4 },
  input: { height: 40, borderWidth: 1, borderColor: '#bbb', borderRadius: 6, paddingHorizontal: 8, backgroundColor: '#fff' },
  inputDisabled: { backgroundColor: '#eee' },
  accordionSection: { marginVertical: 10 },
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ccc', padding: 12, borderRadius: 6, marginBottom: 6 },
  accordionHeaderText: { fontWeight: '600', fontSize: 16 },
  accordionArrow: { fontSize: 16 },
  accordionContent: { backgroundColor: '#eee', padding: 10, borderRadius: 6, marginBottom: 10 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  button: { flex: 1, marginHorizontal: 5, borderRadius: 6 },
});

export default ItemDetailsScreen;

// The rest of the CreateInvoiceScreen file will follow in the next message due to length.
