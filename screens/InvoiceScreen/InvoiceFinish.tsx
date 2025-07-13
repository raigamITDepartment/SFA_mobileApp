// File: InvoiceFinish.tsx

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AuthNavigator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Print from "expo-print";

type InvoiceFinishProps = NativeStackScreenProps<
  RootStackParamList,
  "InvoiceFinish"
>;

const InvoiceFinish = ({
  navigation,
  route,
}: InvoiceFinishProps): React.JSX.Element => {
  const { invoiceData } = route.params;

  const {
    customerName,
    invoiceType,
    invoiceMode,
    items,
    invoiceSubtotal,
    billDiscount,
    billDiscountValue,
    invoiceNetValue,
    totalFreeIssue,
    totalGoodReturns,
    totalMarketReturns,
    invoiceDate,
  } = invoiceData;

  const displayDate = new Date(invoiceDate);
  const formattedDate = `${displayDate.toLocaleDateString()} ${displayDate.toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  )}`;

  const selectedItems = useMemo(
    () =>
      items.filter(
        (item: any) =>
          (parseInt(item.quantity, 10) || 0) > 0 ||
          (parseInt(item.goodReturnQty, 10) || 0) > 0 ||
          (parseInt(item.marketReturnQty, 10) || 0) > 0 ||
          (parseInt(item.freeIssue, 10) || 0) > 0
      ),
    [items]
  );

  const categorizedItems = useMemo(() => {
    return selectedItems.reduce((acc: Record<string, any[]>, item: any) => {
      // Fallback for any items that might still be missing a category
      const category = item.category || 'Selected Items';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
  }, [selectedItems]);

  const handlePrint = async () => {
    const itemsHtml = selectedItems
      .map(
        (item: any) => `
      <tr>
        <td>${item.itemName}</td>
        <td style="text-align: right;">${parseFloat(
          item.unitPrice || "0"
        ).toFixed(2)}</td>
        <td style="text-align: center;">${parseFloat(
          item.specialDiscount || "0"
        ).toFixed(2)}%</td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: center;">${item.freeIssue}</td>
        <td style="text-align: right;">${parseFloat(item.lineTotal).toFixed(2)}</td>
      </tr>
    `
      )
      .join("");

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h1 { font-size: 22px; margin: 0; }
            .header h2 { font-size: 16px; font-weight: bold; margin: 5px 0; }
            .header p { font-size: 12px; margin: 2px 0; color: #333; }
            .details-row { margin: 10px 0; font-size: 11px; color: #555; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .summary { margin-top: 20px; padding-top: 10px; border-top: 2px solid #333; }
            .summary-item { display: flex; justify-content: space-between; padding: 2px 0; }
            .summary-item.total { font-weight: bold; font-size: 14px; }
            .footer-text { text-align: center; margin-top: 40px; font-size: 10px; color: #777; }
            .signature { margin-top: 60px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Raigam Marketing Services</h1>
            <h2>${customerName}</h2>
            <p>Address: _________________________</p>
            <p>Vat Invoice Number: ______________</p>
            <p>Date: ${formattedDate}</p>
            <p>Type: ${invoiceType} | Mode: ${invoiceMode}</p>
          </div>
          <div class="details-row">
            <p>Sale Rep: ________ | Territory: ________ | Distributor: ________</p>
            <p>Invoice No: ________ | Dealer Code: ________</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th style="text-align: center;">Unit Price</th>
                <th style="text-align: center;">Discount (%)</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: center;">Free</th>
                <th style="text-align: right;">Value (Rs)</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div class="summary">
            <div class="summary-item"><span>Gross:</span><span>Rs. ${invoiceSubtotal.toFixed(
              2
            )}</span></div>
            <div class="summary-item"><span>Bill Discount (${billDiscount.toFixed(
              2
            )}%):</span><span>Rs. ${billDiscountValue.toFixed(2)}</span></div>
            <div class="summary-item total"><span>Net Value:</span><span>Rs. ${invoiceNetValue.toFixed(
              2
            )}</span></div>
            <div style="margin-top: 15px; font-size: 11px;"><p>Total Free Issues: ${totalFreeIssue}</p><p>Total Good Returns: ${totalGoodReturns}</p><p>Total Market Returns: ${totalMarketReturns}</p></div>
          </div>
          <div class="footer-text signature"><p>_________________________</p><p>Customer Seal and Signature</p></div>
          <div class="footer-text"><p>---END---</p><p>Solution by Raigam IT</p></div>
        </body>
      </html>
    `;

    await Print.printAsync({ html: htmlContent });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back-outline"
          size={28}
          color="white"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>Raigam</Text>
        <Ionicons name="notifications-outline" size={28} color="white" />
      </View>

      <ScrollView style={styles.invoiceContainer}>
        <View>
          <Text style={styles.InvoiceHeader}>Raigam Markerting Services</Text>
          <Text style={styles.invoiceHeader}>{customerName}</Text>
          <Text style={styles.subHeader}>Address: </Text>
          <Text style={styles.subHeader}>Vat Invoice Number:</Text>
          <Text style={styles.subHeader}>Date: {formattedDate}</Text>
          <Text style={styles.subHeader}>Type: {invoiceType}</Text>
          <Text style={styles.subHeader}>Mode: {invoiceMode}</Text>
        </View>

        <View style={styles.detailsRow}>
          <Text style={styles.detailsText}>Sale Rep: | Territory: | Distributor:</Text>
          <Text style={styles.detailsText}>Invoice No: | Dealer Code:</Text>
        </View>

        <View style={styles.table}>
          {Object.entries(categorizedItems).map(([category, categoryItems]) => (
            <View key={category}>
              <Text style={styles.categoryHeader}>{category}</Text>
              {(categoryItems as any[]).map((item: any, idx: number) => (
                <View key={`${item.itemName}-${idx}`} style={styles.itemRowContainer}>
                  <Text style={styles.itemNameText}>{item.itemName}</Text>
                  <View style={styles.itemDetailsRow}>
                    <Text style={styles.itemDetailsText}>
                      Price: {parseFloat(item.unitPrice || "0").toFixed(2)}
                    </Text>
                    <Text style={styles.itemDetailsText}>
                      Disc: {parseFloat(item.specialDiscount || "0").toFixed(2)}%
                    </Text>
                    <Text style={styles.itemDetailsText}>Qty: {item.quantity}</Text>
                    <Text style={styles.itemDetailsText}>
                      Free: {item.freeIssue}
                    </Text>
                  </View>
                  <Text style={styles.itemTotalText}>
                    Value (Rs): {parseFloat(item.lineTotal || "0").toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text>Gross: Rs. {invoiceSubtotal.toFixed(2)}</Text>
          <Text>
            Bill Discount ({billDiscount.toFixed(2)}%): Rs.{" "}
            {billDiscountValue.toFixed(2)}
          </Text>
          <Text>Net Value: Rs. {invoiceNetValue.toFixed(2)}</Text>
          <Text style={{ marginTop: 10 }}>
            Total Free Issues: {totalFreeIssue}
          </Text>
          <Text>Total Good Returns: {totalGoodReturns}</Text>
          <Text>Total Market Returns: {totalMarketReturns}</Text>
        </View>
        <Text style={styles.centerText}>Customer Seal and Signature</Text>
        <View style={styles.EndText}>
          <Text style={styles.centerText}>---END---</Text>
          <Text style={styles.centerText}>Solution by Raigam IT</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handlePrint}>
          <Text style={styles.buttonText}>Print</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            try {
              await AsyncStorage.clear();
              navigation.navigate("Home");
            } catch (e) {
              console.error("Failed to clear AsyncStorage.", e);
            }
          }}
        >
          <Text style={styles.buttonText}>Sync & Finish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InvoiceFinish;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ff6767",
    padding: 10,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "white" },
  invoiceContainer: {
    margin: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  invoiceHeader: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },

  InvoiceHeader: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },

  subHeader: { fontSize: 14, textAlign: "center", color: "#666" },

  detailsRow: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  categoryHeader: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    marginVertical: 8,
    borderRadius: 6,
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsText: { fontSize: 14, color: "#666", paddingVertical: 1 },

  table: { marginVertical: 10, borderTopWidth: 1, borderTopColor: "#eee" },
  itemRowContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemNameText: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 4,
  },
  itemDetailsText: {
    fontSize: 14,
    color: "#333",
  },
  itemDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  itemTotalText: {
    marginTop: 4,
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
  },
  section: { marginVertical: 10 },
  centerText: { textAlign: "center", marginVertical: 5 },

  EndText: {
    textAlign: "center",
    marginVertical: 5,
    marginTop: 90,
    fontWeight: "bold",
    color: "#888",
  },
  footer: { flexDirection: "row", justifyContent: "space-around", padding: 10 },
  button: {
    backgroundColor: "#ff0000",
    padding: 10,
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
