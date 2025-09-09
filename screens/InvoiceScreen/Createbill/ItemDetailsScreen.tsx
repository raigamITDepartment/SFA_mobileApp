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
import { Button, Menu } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/AuthNavigator';
import { useAppDispatch, useAppSelector } from '../../../store/Hooks';
import { fetchItemIdbyPrice } from '../../../actions/InvoiceAction';
import { RootState } from '@/store';

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

interface Price {
  id: number;
  itemPrice: number;
}

type PriceMenuProps = {
  label: string;
  visible: boolean;
  onDismiss: () => void;
  onPress: () => void;
  loading: boolean;
  price: string;
  prices: Price[];
  onSelect: (price: string, id: number) => void;
};

const PriceMenu: React.FC<PriceMenuProps> = ({
  label,
  visible,
  onDismiss,
  onPress,
  loading,
  price,
  prices,
  onSelect,
}) => (
  <View style={styles.labelInput}>
    <Text style={styles.label}>{label}</Text>
    <Menu
      visible={visible}
      onDismiss={onDismiss}
      anchor={
        <TouchableOpacity style={[styles.input, styles.dropdown]} onPress={onPress} disabled={loading}>
          <Text style={styles.dropdownText}>
            {loading ? 'Loading prices...' : price ? `Rs. ${price}` : 'Select a price'}
          </Text>
        </TouchableOpacity>
      }
    >
      {prices && prices.length > 0 ? (
        prices.map((p) => (
          <Menu.Item key={p.id} onPress={() => onSelect(String(p.itemPrice), p.id)} title={`Rs. ${p.itemPrice}`} />
        ))
      ) : (
        <Menu.Item disabled title={loading ? 'Loading...' : 'No prices available'} />
      )}
    </Menu>
  </View>
);

type ItemDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'ItemDetailsScreen'>;

const ItemDetailsScreen = ({ navigation, route }: ItemDetailsScreenProps): React.JSX.Element => {
  const { customerName, item } = route.params;
  const { itemName, itemId } = item;

  const dispatch = useAppDispatch();
  const rangeId = useAppSelector((state: RootState) => state.login.user.data.rangeId);
  const { Price: prices = [], loading: priceLoading } = useAppSelector(
    (state: RootState) => state.Price
  );

  const [priceMenuVisible, setPriceMenuVisible] = useState(false);
  const [priceMenuGRVisible, setPriceMenuGRVisible] = useState(false);
  const [priceMenuMRVisible, setPriceMenuMRVisible] = useState(false);

  const [unitPrice, setUnitPrice] = useState(item.unitPrice || '');
  const [sellPriceId, setSellPriceId] = useState<number | null>(item.sellPriceId || null);
  const [goodReturnPriceId, setGoodReturnPriceId] = useState<number | null>(item.goodReturnPriceId || null);
  const [marketReturnPriceId, setMarketReturnPriceId] = useState<number | null>(item.marketReturnPriceId || null);
  const [unitPriceGR, setUnitPriceGR] = useState(item.unitPriceGR || '');
  const [unitPriceMR, setUnitPriceMR] = useState(item.unitPriceMR || '');
  const [quantity, setQuantity] = useState(item.quantity || '');
  const [specialDiscount, setSpecialDiscount] = useState(item.specialDiscount || '');
  const [freeIssue, setFreeIssue] = useState(item.freeIssue || '');
  const [showGoodReturn, setShowGoodReturn] = useState(false);
  const [showMarketReturn, setShowMarketReturn] = useState(false);
  const [goodReturnQty, setGoodReturnQty] = useState(item.goodReturnQty || '');
  const [goodReturnFreeQty, setGoodReturnFreeQty] = useState(item.goodReturnFreeQty || '');
  const [goodReturnTotal, setGoodReturnTotal] = useState('');
  const [marketReturnQty, setMarketReturnQty] = useState(item.marketReturnQty || '');
  const [marketReturnFreeQty, setMarketReturnFreeQty] = useState(item.marketReturnFreeQty || '');
  const [marketReturnTotal, setMarketReturnTotal] = useState('');
  const [lineTotal, setLineTotal] = useState(item.lineTotal || '');
  const [itemDiscountValue, setItemDiscountValue] = useState('');

  useEffect(() => {
    if (itemId && rangeId) {
      dispatch(fetchItemIdbyPrice(itemId, Number(rangeId)));
    }
  }, [dispatch, itemId, rangeId]);

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

    const baseAmount = unit * qty;
    const discountValue = baseAmount * (discount / 100);
    setItemDiscountValue(discountValue.toFixed(2));
    const finalTotal = baseAmount - discountValue - goodTotal - marketTotal;

    setLineTotal(finalTotal.toFixed(2));
  }, [unitPrice, quantity, freeIssue, specialDiscount, goodReturnQty,unitPriceGR ,goodReturnFreeQty, marketReturnQty,unitPriceMR, marketReturnFreeQty]);

  const handleSave = async () => {
    const itemData = {
      itemName,
      itemId,
      unitPrice,
      sellPriceId,
      goodReturnPriceId,
      marketReturnPriceId,
      quantity,
      specialDiscount,
      freeIssue,
      goodReturnQty,
      goodReturnFreeQty,
      marketReturnQty,
      marketReturnFreeQty,
      lineTotal,
      unitPriceGR,
      unitPriceMR,
    };

    try {
      await AsyncStorage.setItem(`item_${itemId}`, JSON.stringify(itemData));
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
        <Text style={styles.itemName}>Item ID : {itemId}</Text>
      {/* <Text style={styles.itemCode}>Item code : 866543CF</Text> */}

      <View style={styles.inputGroup}>
        <LabelInput label="Available Stock" value="10000" editable={false} />
        <LabelInput label="Unit of Measure" value="Pkt" editable={false} />
        <PriceMenu
          label="Unit Price"
          visible={priceMenuVisible}
          onDismiss={() => setPriceMenuVisible(false)}
          onPress={() => setPriceMenuVisible(true)}
          loading={priceLoading}
          price={unitPrice}
          prices={prices}
          onSelect={(price, id) => {
            setUnitPrice(price);
            setSellPriceId(id);
            setPriceMenuVisible(false);
          }}
        />
        <LabelInput label="Adjusted Unit Price Rs." value={unitPrice || '0.00'} editable={false} />
        <LabelInput label="Quantity" value={quantity} onChangeText={setQuantity} />
        <LabelInput label="Special Discount (%)" value={specialDiscount} onChangeText={setSpecialDiscount} />
        <LabelInput label="Free Issue" value={freeIssue} onChangeText={setFreeIssue} />
        <LabelInput label="Item Discount Value" value={itemDiscountValue} editable={false} />
      </View>

      <View style={styles.accordionSection}>
        <TouchableOpacity style={styles.accordionHeader} onPress={() => setShowGoodReturn(!showGoodReturn)}>
          <Text style={styles.accordionHeaderText}>Good Return Details</Text>
          <Text style={styles.accordionArrow}>{showGoodReturn ? '▲' : '▼'}</Text>
        </TouchableOpacity>
        {showGoodReturn && (
          <View style={styles.accordionContent}>
            <PriceMenu
              label="Unit Price GoodReturn"
              visible={priceMenuGRVisible}
              onDismiss={() => setPriceMenuGRVisible(false)}
              onPress={() => setPriceMenuGRVisible(true)}
              loading={priceLoading}
              price={unitPriceGR}
              prices={prices}
              onSelect={(price, id) => {
                setUnitPriceGR(price);
                setGoodReturnPriceId(id);
                setPriceMenuGRVisible(false);
              }}
            />
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
            <PriceMenu
              label="Unit Price MarketReturn"
              visible={priceMenuMRVisible}
              onDismiss={() => setPriceMenuMRVisible(false)}
              onPress={() => setPriceMenuMRVisible(true)}
              loading={priceLoading}
              price={unitPriceMR}
              prices={prices}
              onSelect={(price, id) => {
                setUnitPriceMR(price);
                setMarketReturnPriceId(id);
                setPriceMenuMRVisible(false);
              }}
            />
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
  dropdown: {
    justifyContent: 'center',
  },
  dropdownText: {
    fontSize: 14,
  },
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
