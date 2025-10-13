import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '../../../store/Hooks';
import { createInvoice } from '../../../actions/InvoiceAction';
import NetInfo from '@react-native-community/netinfo';
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
    Home: undefined;
    UnsyncedInvoicesScreen: undefined;
};

type UnsyncedInvoicesProps = NativeStackScreenProps<RootStackParamList, "UnsyncedInvoicesScreen">;

const UnsyncedInvoicesScreen = ({ navigation }: UnsyncedInvoicesProps) => {
    const [unsyncedInvoices, setUnsyncedInvoices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const dispatch = useAppDispatch();

    const loadUnsyncedInvoices = async () => {
        try {
            const storedInvoices = await AsyncStorage.getItem('@unsynced_invoices');
            if (storedInvoices) {
                setUnsyncedInvoices(JSON.parse(storedInvoices));
            } else {
                setUnsyncedInvoices([]);
            }
        } catch (e) {
            console.error("Failed to load unsynced invoices", e);
            setUnsyncedInvoices([]);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadUnsyncedInvoices();
        }, [])
    );

    const handleSyncAll = async () => {
        const networkState = await NetInfo.fetch();
        if (!networkState.isConnected) {
            Alert.alert("No Connection", "An internet connection is required to sync invoices.");
            return;
        }

        if (unsyncedInvoices.length === 0) {
            Alert.alert("No Invoices", "There are no invoices to sync.");
            return;
        }

        setIsSyncing(true);
        const syncPromises = unsyncedInvoices.map(invoice => dispatch(createInvoice(invoice)));

        try {
            await Promise.all(syncPromises);
            // If all promises resolve, clear the unsynced invoices from storage
            await AsyncStorage.removeItem('@unsynced_invoices');
            setUnsyncedInvoices([]);
            Alert.alert("Success", "All pending invoices have been synced.");
        } catch (error) {
            console.error("An error occurred during sync:", error);
            Alert.alert("Sync Failed", "Some invoices could not be synced. Please try again.");
            // Reload the remaining unsynced invoices
            await loadUnsyncedInvoices();
        } finally {
            setIsSyncing(false);
        }
    };

    const renderItem = ({ item, index }: { item: any, index: number }) => (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Pending Invoice {index + 1}</Text>
            <Text style={styles.itemSubText}>Outlet ID: {item.outletId}</Text>
            <Text style={styles.itemSubText}>Items: {item.invoiceDetailDTOList.length}</Text>
        </View>
    );

    return (
        <LinearGradient colors={["#ff6666", "#ff0000"]} style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="arrow-back-outline" size={28} color="white" onPress={() => navigation.navigate("Home")} />
                <Text style={styles.title}>Unsynced Invoices</Text>
                <View style={{ width: 28 }} />
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" color="#fff" style={{ flex: 1 }} />
            ) : (
                <FlatList
                    data={unsyncedInvoices}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={<Text style={styles.emptyText}>No pending invoices to sync.</Text>}
                    contentContainerStyle={{ padding: 20 }}
                />
            )}

            <TouchableOpacity
                style={[styles.syncButton, (isSyncing || unsyncedInvoices.length === 0) && styles.disabledButton]}
                onPress={handleSyncAll}
                disabled={isSyncing || unsyncedInvoices.length === 0}
            >
                {isSyncing ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.syncButtonText}>Sync All ({unsyncedInvoices.length})</Text>
                )}
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 40, paddingBottom: 10 },
    title: { fontSize: 22, fontWeight: 'bold', color: 'white' },
    itemContainer: { backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 15, borderRadius: 10, marginBottom: 10 },
    itemText: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    itemSubText: { fontSize: 14, color: '#555', marginTop: 4 },
    emptyText: { textAlign: 'center', color: 'white', fontSize: 16, marginTop: 50 },
    syncButton: { backgroundColor: '#4caf50', padding: 15, margin: 20, borderRadius: 10, alignItems: 'center' },
    syncButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    disabledButton: { backgroundColor: '#9E9E9E' },
});

export default UnsyncedInvoicesScreen;