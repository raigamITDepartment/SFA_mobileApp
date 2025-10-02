import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Image, ActivityIndicator } from "react-native";
import { Text, Card, Menu, Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as Location from "expo-location";
//import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import SearchableDropdown from "../../components/ui/CustomerDropdown";

import { LinearGradient } from "expo-linear-gradient";
import { useAppDispatch, useAppSelector, RootState } from "../../store/Hooks";
import {
  fetchRoutesByTerritoryId,
  fetchRouteIdbyOutlet,
  fetchOutletById,
  updateOutlet,
} from "../../actions/OutletAction"; // Assuming resetCreateOutletState is also exported from here
import { resetCreateOutletState } from "../../reducers/OutletReducer";
import { resetOutletDetails, setOutletDetailsError } from "../../reducers/FetchOutletDetailsReducer";
import type { AppDispatch } from "../../store";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/AuthNavigator";

type UpdateOutletProps = NativeStackScreenProps<
  RootStackParamList,
  "UpdateOutlet"
>;

const UpdateOutlet = ({
  navigation,
  route,
}: UpdateOutletProps): React.ReactElement => {
  // UpdateOutletScreen Component
  const dispatch: AppDispatch = useAppDispatch();
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [shopStatus, setShopStatus] = useState("");
  const [category, setCategory] = useState("");
  const [outletName, setOutletName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [address3, setAddress3] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [mobile, setMobile] = useState("");
  const [vatNum, setVatNum] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  // State for location
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const territoryId = useAppSelector(
    (state) => state.login.user?.data?.territoryId
  );

  const userId = useAppSelector(
    (state) => state.login.user?.data?.userId
  );
  const rangeId = useAppSelector(
    (state) => state.login.user?.data?.rangeId
  );

  const { routes = [], loading: routesLoading = true } =
    useAppSelector((state) => state.fetchRoute) || {};

  const { outlets = [], loading: outletsLoading = true } =
    useAppSelector((state) => state.fetchOutlet) || {};
  
  const { details: outletDetails, loading: detailsLoading } = useAppSelector(
    (state: RootState) => state.outletDetails
  );

  const {
    loading: updateLoading,
    success: updateSuccess,
    error: updateError,
  } = useAppSelector((state: RootState) => state.outlet);


  const [menuVisible, setMenuVisible] = useState({
    route: false,
    outlet: false,
    shopStatus: false,
    category: false,
  });

  const handleUpdateOutlet = async () => {
    if (!selectedCustomer || !outletDetails) {
      Alert.alert("Error", "No outlet selected for update.");
      return;
    }

    const formData = new FormData();
    formData.append("id", selectedCustomer);
    formData.append("outletName", outletName);
    formData.append("ownerName", contactPerson);
    formData.append("mobileNo", mobile);
    formData.append("address1", address1);
    formData.append("address2", address2);
    formData.append("address3", address3);
    formData.append("vatNum", vatNum);
    formData.append("outletCategoryId", category);
    formData.append("isClose", shopStatus === 'true' ? 'true' : 'false');
    formData.append("routeId", selectedRoute);

    // Add missing required fields based on the validation error
    if (userId) formData.append("userId", String(userId));
    if (rangeId) formData.append("rangeId", String(rangeId));
    if (latitude) formData.append("latitude", String(latitude));
    if (longitude) formData.append("longitude", String(longitude));
    
    // These values should come from the fetched outlet details
    formData.append("isNew", String(outletDetails.isNew));
    formData.append("isApproved", String(outletDetails.isApproved));
    formData.append("openTime", outletDetails.openTime || "08:00");
    formData.append("closeTime", outletDetails.closeTime || "17:00");

    // Append other necessary fields that might not be editable but are required by the backend
    // These might come from outletDetails
    if (outletDetails.uniqueCode) formData.append("uniqueCode", outletDetails.uniqueCode);
    if (outletDetails.outletCode) formData.append("outletCode", outletDetails.outletCode);
    if (outletDetails.displayOrder) formData.append("displayOrder", String(outletDetails.displayOrder));
    if (outletDetails.outletSequence) formData.append("outletSequence", String(outletDetails.outletSequence));


    if (imageUri && !imageUri.startsWith('http')) {
      // New image has been selected
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 1024 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      const uriParts = manipResult.uri.split(".");
      const fileType = uriParts[uriParts.length - 1] || "jpeg";
      formData.append("image", {
        uri: manipResult.uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      } as any);
    } else if (imageUri === null) {
      // Image was removed
      formData.append("image", ""); // Send empty to signify removal if API supports it
    }
    

    dispatch(updateOutlet(formData));
  };
  
  const resetForm = () => {
    setOutletName("");
    setAddress1("");
    setAddress2("");
    setAddress3("");
    setContactPerson("");
    setMobile("");
    setCategory("");
    setImageUri(null);
    setVatNum("");
    setShopStatus("");
    setSelectedCustomer("");
    dispatch(resetOutletDetails());
  };



  useEffect(() => {
    if (territoryId) {
      dispatch(fetchRoutesByTerritoryId(territoryId));
    }

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Permission to access location was denied."
        );
        return;
      }
      try {
        let location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
      } catch (error) {
        console.error("Failed to get location", error);
      }
    })();
  }, [territoryId, dispatch]);

  useEffect(() => {
    if (route.params?.routeId) {
      const routeIdStr = String(route.params.routeId);
      setSelectedRoute(routeIdStr);
      // Also fetch outlets for this pre-selected route
      dispatch(fetchRouteIdbyOutlet(Number(routeIdStr)));
    }
  }, [route.params, dispatch]);

  const handleRouteChanged = (routeId: string) => {
    setSelectedRoute(routeId);
    setSelectedCustomer("");
    resetForm();
    if (routeId) {
      dispatch(fetchRouteIdbyOutlet(Number(routeId)));
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission to access camera is required!");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleCustomerChanged = (customerId: string) => {
    setSelectedCustomer(customerId);
    if (customerId) {
      dispatch(fetchOutletById(Number(customerId)));
    } else {
      resetForm();
    }
  };

  useEffect(() => {
    if (outletDetails) {
      setOutletName(outletDetails.outletName || "");
      setAddress1(outletDetails.address1 || "");
      setAddress2(outletDetails.address2 || "");
      setAddress3(outletDetails.address3 || "");
      setContactPerson(outletDetails.ownerName || "");
      setMobile(outletDetails.mobileNo || "");
      setVatNum(outletDetails.vatNum || "");
      setCategory(String(outletDetails.outletCategoryId) || "");
      setShopStatus(String(outletDetails.isClose)); // 'true' or 'false'
      setImageUri(outletDetails.imagePath || null);
    }
  }, [outletDetails]);

  useEffect(() => {
    if (updateSuccess) {
      Alert.alert("Success", "Outlet updated successfully!", [
        {
          text: "OK",
          onPress: () => {
            resetForm();
            dispatch(resetCreateOutletState()); // Reset the update status
            navigation.goBack();
          },
        },
      ]);
    }
    if (updateError) {
      Alert.alert("Error", (updateError as any).message || "Failed to update outlet.", [
        {
          text: "OK", onPress: () => dispatch(resetCreateOutletState()) // Reset the update status
        }
      ]);
    }
  }, [updateSuccess, updateError, navigation, dispatch]);

  return (
    <LinearGradient colors={["#ff6666", "#ff0000"]} style={styles.gradient}>
      <ScrollView style={styles.container}>
      <View style={styles.card}>
          <Text style={styles.title}>Update Outlet</Text>

          {/* Dropdown: Select Route */}
          <Text style={styles.label}>Select Route</Text>
               <SearchableDropdown
                   label=""
                   selectedValue={selectedRoute}
                   setSelectedValue={handleRouteChanged}
                   options={routes.map((r: any) => ({ id: r.id, name: r.routeName }))}
                   loading={routesLoading}
                 />

          {/* Dropdown: Select Outlet */}
          <Text style={styles.label}>Select Outlet</Text>
         <SearchableDropdown
                  label=""
                  selectedValue={selectedCustomer}
                  setSelectedValue={handleCustomerChanged}
                  options={outlets.map((c: any) => ({ id: c.id, name: c.outletName }))}
                  loading={outletsLoading}
                  disabled={!selectedRoute || outletsLoading}
                />

          {detailsLoading ? (
            <ActivityIndicator style={{ marginVertical: 20 }} size="large" />
          ) : selectedCustomer && (
            <>
              <TextInput style={styles.input} placeholder="Outlet Name" value={outletName} onChangeText={setOutletName} />
              <TextInput style={styles.input} placeholder="Address 1" value={address1} onChangeText={setAddress1} />
              <TextInput style={styles.input} placeholder="Address 2" value={address2} onChangeText={setAddress2} />
              <TextInput style={styles.input} placeholder="Address 3" value={address3} onChangeText={setAddress3} />
              <TextInput style={styles.input} placeholder="Contact Person" value={contactPerson} onChangeText={setContactPerson} />
              <TextInput style={styles.input} placeholder="Mobile No" value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
              <TextInput style={styles.input} placeholder="VAT No" value={vatNum} onChangeText={setVatNum} />
            </>
          )}

          {/* Dropdown: Outlet Open / Close */}
          <Text style={styles.label}>Outlet Open / Close</Text>
          <SearchableDropdown
            label=""
            selectedValue={shopStatus}
            setSelectedValue={setShopStatus}
            options={[
              { id: 'false', name: 'Open' },
              { id: 'true', name: 'Close' },
            ]}
          />
          
    
          
          {/* Dropdown: Shop Category */}
          <Text style={styles.label}>Shop Category</Text>
          <SearchableDropdown
            label=""
            selectedValue={category}
            setSelectedValue={setCategory}
            options={[
              { id: '1', name: 'Small Bakery' },
              { id: '2', name: 'Large Bakery' },
              { id: '3', name: 'Grocery' },
              { id: "4", name: "Small Whole Sale" },
              { id: "5", name: "Large Whole Sale" },
              { id: "6", name: "Co-Operative" },
              { id: "7", name: "Super Market" },
              { id: "8", name: "Hotel or Others" },
              { id: "9", name: "Canteen" },
              { id: "10", name: "Pharmacy" },
              { id: "12", name: "Co-op City" },
              { id: "13", name: "Beauty Salons" },
            ]}
          />

          {/* Image Buttons */}
          <View style={styles.imageContainer}>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
          </View>
          <View style={styles.imageButtonsContainer}>
            <Button icon="camera" mode="outlined" onPress={takePhoto} style={styles.imageButton}>
              {imageUri ? 'Retake Photo' : 'Take Photo'}
            </Button>
            {imageUri && <Button mode="outlined" onPress={() => setImageUri(null)} style={styles.imageButton}>Remove Photo</Button>}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleUpdateOutlet}
              style={styles.createButton}
              disabled={updateLoading}
            >
              {updateLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.createText}>Update</Text>}
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
    color: "#000",
  },
  input: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#FFF",
    color: "#000",
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
    justifyContent: "center",
    marginBottom: 16,
    marginTop: 16,
  },
  imageButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  imageButton: {
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
