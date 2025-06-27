import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/AuthNavigator";
import { useAppDispatch, useAppSelector } from "../../store/Hooks";
import { fetchRoutesByTerritoryId } from "../../actions/OutletAction";
import type { AppDispatch } from "../../store"; // adjust the path as needed
import { createSelector } from "reselect";

type StockProps = NativeStackScreenProps<RootStackParamList, "OutletAdd">;
// --- Selectors defined in this file ---
// const selectOutlet = (state: any) => state.outlet;

// const selectRoutes = createSelector(
//   [selectOutlet],
//   (outlet) => (outlet && outlet.routes) ? outlet.routes : []
// );
// // --------------------------------------

const OutletAdd = ({ navigation }: StockProps): React.JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const [date, setDate] = useState(new Date());
  const [selectedRoute, setSelectedRoute] = useState("");
  //const { routes = [], loading = false, error = null } = useSelector((state: any) => state.outlet || {});
  const territoryId = useSelector((state: any) => state.login?.user?.data?.territoryId );
 const roots = useAppSelector((state) => state.root);
// const roots = useAppSelector((state) => state.login.user);
  //const [outlet, setOutlet] = useState("");
  const [outletName, setOutletName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [mobile, setMobile] = useState("");
  const [category, setCategory] = useState("");
  // const [selectedValue, setSelectedValue] = useState('');
  const [image, setImage] = useState<string | null>(null);
  //const territoryId = 1;
  const routes = useSelector((state: any) => state.routes?.routes || []);
  const loading = useSelector((state: any) => state.outlet?.loading);
  const error = useSelector((state: any) => state.outlet?.error);

  useEffect(() => {
    if (
      territoryId !== undefined &&
      territoryId !== null &&
      territoryId !== ""
    ) {
      dispatch(fetchRoutesByTerritoryId(territoryId));
      console.log("Fetching routes for territoryId:", territoryId);
    }
  }, [territoryId]);

  if (loading) return <ActivityIndicator />;
  if (error)
    return <Text style={{ color: "red" }}>{error.error || error}</Text>;

  console.log("Selected Route:", roots);
  // Hardcode the territoryId for testing/demo purposes
  // Remove/comment this line in production!

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access camera is required!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreateOutlet = () => {
    // Submit outlet creation logic
    console.log({
      date,

      // outlet,
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
    <LinearGradient colors={["#ff6666", "#ff0000"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <Text style={styles.title}>Add New Outlet</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Date / Time</Text>
            <TouchableOpacity
              onPress={() => {
                // Get current device date/time and set it
                const now = new Date();
                setDate(now);
              }}
              style={styles.datePicker}
            >
              <Text style={styles.dateText}>
                {date.toLocaleDateString()}{" "}
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.field}>
            <Text>Select Route:</Text>
            <Picker
              selectedValue={selectedRoute}
              onValueChange={(itemValue) => setSelectedRoute(itemValue)}
              style={{ height: 50, width: 250 }}
            >
              <Picker.Item label="Select a route" value="" />
              {(routes || []).map((route: any) => (
                <Picker.Item
                  key={route.id}
                  label={route.routeName}
                  value={route.id}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Add After</Text>
            <Picker
              selectedValue={selectedRoute}
              onValueChange={(itemValue) => setSelectedRoute(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Outlet" value="" />
              <Picker.Item label="Outlet 1" value="outlet1" />
              <Picker.Item label="Outlet 2" value="outlet2" />
            </Picker>
          </View>

          <View style={styles.field}>
            <View style={styles.imageContainer}>
              <Button
                icon="camera"
                mode="outlined"
                style={styles.imageButton}
                onPress={takePhoto}
              >
                Take Photo
              </Button>
            </View>
          </View>

          <View style={styles.fieldImg}>
            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 100, height: 100, marginBottom: 10 }}
              />
            )}
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
    fontWeight: "600",
    marginBottom: 16,

    textAlign: "center",
  },
  field: {
    marginBottom: 16,
    borderRadius: 8,
  },

  fieldImg: {
    marginBottom: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#FFF",
  },
  picker: {
    borderColor: "#CCC",
    borderRadius: 20,
    backgroundColor: "#FFF",
  },
  datePicker: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  dateText: {
    fontSize: 16,
    color: "#555",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
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
  card: {
    padding: 16,
    borderRadius: 8,
    marginTop: 35,
  },

  imageButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
});

export default OutletAdd;
