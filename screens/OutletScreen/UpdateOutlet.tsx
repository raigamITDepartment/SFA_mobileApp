import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Text, Card, Menu, Button } from "react-native-paper";
//import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { LinearGradient } from "expo-linear-gradient";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/AuthNavigator";

type UpdateOutletProps = NativeStackScreenProps<
  RootStackParamList,
  "UpdateOutlet"
>;

const UpdateOutlet = ({
  navigation,
}: UpdateOutletProps): React.ReactElement => {
  // UpdateOutletScreen Component

  const [route, setRoute] = useState("");
  const [outlet, setOutlet] = useState("");
  const [shopStatus, setShopStatus] = useState("");
  const [category, setCategory] = useState("");

  const [menuVisible, setMenuVisible] = useState({
    route: false,
    outlet: false,
    shopStatus: false,
    category: false,
  });

  const toggleMenu = (key: keyof typeof menuVisible) => {
    setMenuVisible((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCreateOutlet = () => {
    // Submit outlet creation logic
    console.log({
      route,
      outlet,
      shopStatus,
      category,
    });
  };

  return (
    <LinearGradient colors={["#ff6666", "#ff0000"]} style={styles.gradient}>
      <ScrollView style={styles.container}>
      <View style={styles.card}>
          <Text style={styles.title}>Update Outlet</Text>

          {/* Dropdown: Select Route */}
          <Text style={styles.label}>Select Route</Text>
          <Menu
            visible={menuVisible.route}
            onDismiss={() => toggleMenu("route")}
            anchor={
              <TouchableOpacity
                onPress={() => toggleMenu("route")}
                style={styles.dropdown}
              >
                <Text>{route || "Select Route"}</Text>
              </TouchableOpacity>
            }
          >
            {["Route 1", "Route 2", "Route 3"].map((item) => (
              <Menu.Item
                key={item}
                onPress={() => {
                  setRoute(item);
                  toggleMenu("route");
                }}
                title={item}
              />
            ))}
          </Menu>

          {/* Dropdown: Select Outlet */}
          <Text style={styles.label}>Select Outlet</Text>
          <Menu
            visible={menuVisible.outlet}
            onDismiss={() => toggleMenu("outlet")}
            anchor={
              <TouchableOpacity
                onPress={() => toggleMenu("outlet")}
                style={styles.dropdown}
              >
                <Text>{outlet || "Select Outlet"}</Text>
              </TouchableOpacity>
            }
          >
            {["Outlet 1", "Outlet 2", "Outlet 3"].map((item) => (
              <Menu.Item
                key={item}
                onPress={() => {
                  setOutlet(item);
                  toggleMenu("outlet");
                }}
                title={item}
              />
            ))}
          </Menu>

          {/* Dropdown: Outlet Open / Close */}
          <Text style={styles.label}>Outlet Open / Close</Text>
          <Menu
            visible={menuVisible.shopStatus}
            onDismiss={() => toggleMenu("shopStatus")}
            anchor={
              <TouchableOpacity
                onPress={() => toggleMenu("shopStatus")}
                style={styles.dropdown}
              >
                <Text>{shopStatus || "Select Status"}</Text>
              </TouchableOpacity>
            }
          >
            {["Open", "Close"].map((item) => (
              <Menu.Item
                key={item}
                onPress={() => {
                  setShopStatus(item);
                  toggleMenu("shopStatus");
                }}
                title={item}
              />
            ))}
          </Menu>

          {/* Dropdown: Shop Category */}
          <Text style={styles.label}>Shop Category</Text>
          <Menu
            visible={menuVisible.category}
            onDismiss={() => toggleMenu("category")}
            anchor={
              <TouchableOpacity
                onPress={() => toggleMenu("category")}
                style={styles.dropdown}
              >
                <Text>{category || "Select Category"}</Text>
              </TouchableOpacity>
            }
          >
            {["Category 1", "Category 2", "Category 3"].map((item) => (
              <Menu.Item
                key={item}
                onPress={() => {
                  setCategory(item);
                  toggleMenu("category");
                }}
                title={item}
              />
            ))}
          </Menu>
          {/* Image Buttons */}
          <View style={styles.imageContainer}>
            <Button icon="upload" mode="outlined" style={styles.imageButton}>
              Upload from Gallery
            </Button>
            <Button icon="camera" mode="outlined" style={styles.imageButton}>
              Take Photo
            </Button>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCreateOutlet}
              style={styles.createButton}
            >
              <Text style={styles.createText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  // card: {
  //   padding: 16,
  //   borderRadius: 8,
  //   marginTop: 35,
  // },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    marginBottom: 4,
    fontSize: 16,
    fontWeight: "bold",
  },
  dropdown: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    padding: 12,
    backgroundColor: "#E57373",
    alignItems: "center",
    borderRadius: 8,
  },
  cancelText: {
    color: "#FFF",
    fontWeight: "600",
  },
  createButton: {
    flex: 1,
    marginLeft: 8,
    padding: 12,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    borderRadius: 8,
  },
  createText: {
    color: "#FFF",
    fontWeight: "600",
  },

  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  imageButton: {
    flex: 1,
    marginHorizontal: 8,
  },
 card: {
     backgroundColor: "white", // Let the theme handle the background color
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },




});

export default UpdateOutlet;
