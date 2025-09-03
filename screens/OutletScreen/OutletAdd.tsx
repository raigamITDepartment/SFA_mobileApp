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
  Alert,
} from "react-native";
import { Text, Card, Button } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/AuthNavigator";
import { useAppDispatch, useAppSelector } from "../../store/Hooks";
import {
  fetchRoutesByTerritoryId,
  createOutlet,
  fetchRouteIdbyOutlet,
} from "../../actions/OutletAction";

import { resetCreateOutletState } from "../../reducers/OutletReducer";
import type { AppDispatch } from "../../store";

import SearchableDropdown from "../../components/ui/CustomerDropdown";

type StockProps = NativeStackScreenProps<RootStackParamList, "OutletAdd">;

const OutletAdd = ({ navigation }: StockProps): React.JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const [date, setDate] = useState(new Date());
  const [selectedRoute, setSelectedRoute] = useState<string>("");

  const territoryId = useAppSelector(
    (state) => state.login.user?.data?.territoryId
  );
  const rangeId = useAppSelector((state) => state.login.user?.data?.rangeId);
  const userId = useAppSelector((state) => state.login.user?.data?.userId);
  const agencyCode = useAppSelector(
    (state) => state.login.user?.data?.agencyCode
  );
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [shopCode, setShopCode] = useState("");
  const [vatNum, setVatNum] = useState("");
  const [outletName, setOutletName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [mobile, setMobile] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [selectedAfter, setSelectedAfter] = useState("");
  const loading = useAppSelector((state) => state.outlet.loading);
  const error = useAppSelector((state) => state.outlet.error);
  const success = useAppSelector((state) => state.outlet.success);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const { routes = [], loading: routesLoading = true } =
    useAppSelector((state) => state.fetchRoute) || {};

  const { outlets = [], loading: outletsLoading = true } =
    useAppSelector((state) => state.fetchOutlet) || {};

  const resetForm = () => {
    //setShopCode("");
    setOutletName("");
    setAddress1("");
    setAddress2("");
    setAddress3("");
    setContactPerson("");
    setMobile("");
    setCategory("");
    setImage(null);
    setSelectedAfter("");
    setSelectedRoute("");
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    })();
  }, []);

  const handleRouteChanged = (routeId: string) => {
    setSelectedRoute(routeId);
    setSelectedCustomer("");
    if (routeId) {
      dispatch(fetchRouteIdbyOutlet(Number(routeId)));
    }
  };

  useEffect(() => {
    if (
      territoryId !== undefined &&
      territoryId !== null &&
      territoryId !== ""
    ) {
      dispatch(fetchRoutesByTerritoryId(territoryId));
      //console.log("Fetching routes for territoryId:", territoryId);
    }
  }, [territoryId, dispatch]);

  useEffect(() => {
    if (success) {
      Alert.alert("Success", "Outlet created successfully!", [
        {
          text: "OK",
          onPress: () => {
            dispatch(resetCreateOutletState());
            resetForm();
            navigation.navigate("Home");
          },
        },
      ]);
    }
    if (error) {
      Alert.alert(
        "Error",
        (error as any).message || "Failed to create outlet.",
        [{ text: "OK", onPress: () => dispatch(resetCreateOutletState()) }]
      );
    }
  }, [success, error, navigation, dispatch]);

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
    if (
      !outletName ||
      !image ||
      !contactPerson ||
      !mobile ||
      !address1 ||
      !address2 ||
      !address3 ||
      !category ||
      !vatNum
    ) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }
    if (!selectedRoute) {
      Alert.alert("Missing Fields", "Please select a route.");
      return;
    }
    if (latitude === null || longitude === null) {
      Alert.alert("Location Error", "Could not determine current location.");
      return;
    }

    const selectedRouteObject = routes.find(
      (r: any) => String(r.id) === selectedRoute
    );
    if (!selectedRouteObject) {
      Alert.alert("Error", "Selected route is invalid.");
      return;
    }
    const formData = new FormData();

    let newDisplayOrder = 1; // Default to 1 if no outlets exist
    let newOutletSequence = 1; // Default to 1 if no outlets exist

    if (selectedCustomer) {
      // If an "Add After" customer is selected, find their display order and add 1
      const afterOutlet = outlets.find(
        (o: any) => String(o.id) === selectedCustomer
      );
      if (afterOutlet) {
        if (typeof afterOutlet.displayOrder === "number") {
          newDisplayOrder = afterOutlet.displayOrder + 1;
        }
        if (typeof afterOutlet.outletSequence === "number") {
          newOutletSequence = afterOutlet.outletSequence + 1;
        }
      }
    } else {
      // If no "Add After" customer is selected, find the max order and add 1
      // to place the new outlet at the end of the list.
      if (outlets.length > 0) {
        const maxDisplayOrder = Math.max(
          ...outlets.map((o: any) => o.displayOrder || 0)
        );
        newDisplayOrder = maxDisplayOrder + 0;
        const maxOutletSequence = Math.max(
          ...outlets.map((o: any) => o.outletSequence || 0)
        );
        newOutletSequence = maxOutletSequence + 0;
      }
    }

    formData.append("outletName", outletName);
    formData.append("ownerName", contactPerson);
    formData.append("mobileNo", mobile);
    formData.append("address1", address1);
    formData.append("address2", address2);
    formData.append("address3", address3);
    formData.append("outletCategoryId", category || "0");
    formData.append("outletSequence", String(newOutletSequence));
    formData.append("displayOrder", String(newDisplayOrder));
    if (latitude) formData.append("latitude", String(latitude));
    if (longitude) formData.append("longitude", String(longitude));
    formData.append("isNew", "true");
    formData.append("isApproved", "false");
    formData.append("isClose", "false");
    formData.append("routeId", selectedRouteObject.id);
    formData.append("routeCode", selectedRouteObject.routeCode);
    if (rangeId) formData.append("rangeId", String(rangeId));

    if (userId) formData.append("userId", String(userId));
    if (agencyCode) formData.append("agencyCode", String(agencyCode));
    formData.append("openTime", "08:00");
    formData.append("closeTime", "17:00");
    formData.append("vatNum", vatNum);

    if (image) {
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];
      formData.append("image", {
        uri: image,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    }

    dispatch(createOutlet(formData));
    console.log("Creating Outlet with FormData", formData);
  };

  return (
    <LinearGradient colors={["#ff6666", "#ff0000"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* <Card style={styles.card}> */}
           <View style={styles.card}>
          <Text style={styles.title}>Add New Outlet</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Date / Time</Text>
            <View style={styles.datePicker}>
              <Text style={styles.dateText}>
                {date.toLocaleDateString()}{" "}
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Select Route:</Text>

            <SearchableDropdown
              label=""
              selectedValue={selectedRoute}
              setSelectedValue={handleRouteChanged}
              options={routes.map((r: any) => ({
                id: r.id,
                name: r.routeName,
              }))}
              loading={routesLoading}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Add After (Optional)</Text>

            <SearchableDropdown
              label=""
              selectedValue={selectedCustomer}
              setSelectedValue={setSelectedCustomer}
              options={outlets.map((c: any) => ({
                id: c.id,
                name: c.outletName,
              }))}
              loading={outletsLoading}
              disabled={!selectedRoute || outletsLoading}
            />
          </View>

          <View style={styles.imageContainer}>
            <Button
              icon="camera"
              mode="outlined"
              style={styles.imageButton}
              onPress={takePhoto}
            >
              Take Photo
            </Button>
            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 100, height: 100, marginTop: 10 }}
              />
            )}
          </View>
          {/* <TextInput
            style={styles.input}
            placeholder="Enter Shop Code"
            value={shopCode}
            onChangeText={setShopCode}
          /> */}
          {/* <TextInput
            style={styles.input}
            placeholder="Enter Outlet Sequence"
            value={outletSequence}
            keyboardType="numeric"
            onChangeText={setOutletSequence}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Display Order"
            value={displayOrder}
            keyboardType="numeric"
            onChangeText={setDisplayOrder}
          /> */}

          <TextInput
            style={[styles.input, { color: "#000" }]}
            placeholder="Enter Outlet Name"
            placeholderTextColor="#000"
            value={outletName}
            onChangeText={setOutletName}
          />
          <TextInput
            style={[styles.input, { color: "#000" }]}
            placeholder="Enter Address 1"
            placeholderTextColor="#000"
            value={address1}
            onChangeText={setAddress1}
          />
          <TextInput
            style={[styles.input, { color: "#000" }]}
            placeholder="Enter Address 2"
            placeholderTextColor="#000"
            value={address2}
            onChangeText={setAddress2}
          />
          <TextInput
            style={[styles.input, { color: "#000" }]}
            placeholder="Enter Address 3"
            placeholderTextColor="#000"
            value={address3}
            onChangeText={setAddress3}
          />
          <TextInput
            style={[styles.input, { color: "#000" }]}
            placeholder="Contact Person Name"
            placeholderTextColor="#000"
            value={contactPerson}
            onChangeText={setContactPerson}
          />
          <TextInput
            style={[styles.input, { color: "#000" }]}
            placeholder="Enter Mobile No."
            placeholderTextColor="#000"
            value={mobile}
            keyboardType="phone-pad"
            onChangeText={setMobile}
          />

          <View style={styles.field}>
            <Text style={styles.label}>Shop Category</Text>
            <SearchableDropdown
              label=""
              selectedValue={category}
              setSelectedValue={setCategory}
              options={[
                { id: "1", name: "Small Bakery" },
                { id: "2", name: "Large Bakery" },
                { id: "3", name: "Grocery" },
                { id: "4", name: "Small Whole Sale" },
                { id: "5", name: "Large Whole Sale" },
                { id: "6", name: "Co-Operative" },
                { id: "7", name: "Super Market" },
                { id: "8", name: "Hotel or Others" },
                { id: "9", name: "Canteen" },
                { id: "10", name: "Pharmacy" },
                { id: "11", name: "Super Market" },
                { id: "12", name: "Co-op City" },
                { id: "13", name: "Beauty Salons" },
                { id: "14", name: "Ayurveda" },
                { id: "15", name: "Fancy House" },
                { id: "16", name: "Textile Shop" },
                { id: "17", name: "School" },
              ]}
              loading={false}
            />
          </View>

          <TextInput
            style={[styles.input, { color: "#000" }]}
            placeholder="Enter Vat No."
            placeholderTextColor="#000"
            value={vatNum}
            keyboardType="phone-pad"
            onChangeText={setVatNum}
          />

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
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.createText}>Create</Text>
              )}
            </TouchableOpacity>
          </View>
        {/* </Card> */}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { padding: 16 ,color: "#280dc0"},
 // card: { padding: 16, borderRadius: 8, marginTop: 35 },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  field: { marginBottom: 16, marginTop: 8, color: "#000" },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#FFF",
    color: "#555",
  },
  picker: {
    borderColor: "#CCC",
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  datePicker: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    backgroundColor: "#FFF",
  },
  dateText: { fontSize: 16, color: "#555" },
  imageContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 16,
  },
  imageButton: { marginBottom: 10 },
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
  cancelText: { color: "#FFF", fontWeight: "600" },
  createButton: {
    flex: 1,
    marginLeft: 8,
    padding: 12,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    borderRadius: 8,
  },
  createText: { color: "#FFF", fontWeight: "600" },

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

export default OutletAdd;
