// components/ui/CustomerDropdown.tsx

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Option {
  id: string | number;
  name: string;
}

interface CustomerDropdownProps {
  label: string;
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  options: Option[];
  loading?: boolean;
  disabled?: boolean;
}

export default function CustomerDropdown({
  label,
  selectedValue,
  setSelectedValue,
  options,
  loading = false,
  disabled = false,
}: CustomerDropdownProps) {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = useMemo(() => {
    return options.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  const selectedLabel = options.find((o) => String(o.id) === selectedValue)?.name;

  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => {
          if (!loading && !disabled) {
            setSearchQuery('');
            setShowModal(true);
          }
        }}
        disabled={loading || disabled}
      >
        <Text style={styles.dropdownButtonText}>
          {loading ? 'Loading...' : selectedLabel || `Select ${label}`}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#555" />
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select {label}</Text>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Ionicons name="close" size={24} color="#444" />
                </TouchableOpacity>
              </View>

              <TextInput
                placeholder={`Search ${label.toLowerCase()}...`}
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.searchInput}
              />

              <FlatList
                data={filteredOptions}
                keyExtractor={(item) => String(item.id)}
                ListEmptyComponent={
                  <Text style={styles.noResults}>No results found.</Text>
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.item}
                    onPress={() => {
                      setSelectedValue(String(item.id));
                      setSearchQuery('');
                      setShowModal(false);
                    }}
                  >
                    <Text style={styles.itemText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#f4f4f6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dropdownButtonText: {
    fontSize: 15,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  searchInput: {
    height: 42,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    fontSize: 15,
    backgroundColor: '#fafafa',
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderRadius: 6,
  },
  itemText: {
    fontSize: 16,
    color: '#444',
  },
  noResults: {
    textAlign: 'center',
    paddingVertical: 20,
    color: '#999',
  },
});
