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
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/navigation/AuthNavigator";
import { useAppDispatch, useAppSelector } from "../../store/Hooks";
import {
  fetchRoutesByTerritoryId,
  createOutlet,
} from "../../actions/OutletAction";
import { resetCreateOutletState } from "../../reducers/OutletReducer";
import type { AppDispatch } from "../../store";

type StockProps = NativeStackScreenProps<RootStackParamList, "OutletAdd">;

const OutletAdd = ({ navigation }: StockProps): React.JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const [date, setDate] = useState(new Date());
  const [selectedRoute, setSelectedRoute] = useState<any>(null);
  const territoryId = useSelector(
    (state: any) => state.login?.user?.data?.territoryId
  );
  const rangeId = useSelector((state: any) => state.login?.user?.data?.rangeId);
  console.log("Range ID:", );
  const userId = useSelector((state: any) => state.login?.user?.data?.userId);
  const agencyCode = useSelector(
    (state: any) => state.login?.user?.data?.agencyCode
  );

   const userLoginResponse = useAppSelector((state) => state.login.user);

  const Route = useAppSelector((state) => state.root);

  const [shopCode, setShopCode] = useState("");
  const [outletSequence, setOutletSequence] = useState("");
  const [displayOrder, setDisplayOrder] = useState("");
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
  const { loading, error, success } = useAppSelector((state) => ({
    loading: state.outlet.loading,
    error: state.outlet.error,
    success: state.outlet.success,
  }));
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const resetForm = () => {
    setShopCode("");
    setOutletSequence("");
    setDisplayOrder("");
    setOutletName("");
    setAddress1("");
    setAddress2("");
    setAddress3("");
    setContactPerson("");
    setMobile("");
    setCategory("");
    setImage(null);
    setSelectedAfter("");
    setSelectedRoute(null);
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

  useEffect(() => {
    if (
      territoryId !== undefined &&
      territoryId !== null &&
      territoryId !== ""
    ) {
      dispatch(fetchRoutesByTerritoryId(territoryId));
      console.log("Fetching routes for territoryId:", territoryId);
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
      Alert.alert("Error", (error as any).message || "Failed to create outlet.", [
        { text: "OK", onPress: () => dispatch(resetCreateOutletState()) },
      ]);
    }
  }, [success, error, navigation, dispatch]);

  console.log("Available Routes:", Route.routes);

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

      !shopCode ||
      !outletName ||
      !contactPerson ||
      !mobile ||
      !address1 ||
      !address2 ||
      !address3 ||
      !category ||
      !outletSequence ||
      !displayOrder ||
      !selectedRoute
    ) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }
    if (latitude === null || longitude === null) {
      Alert.alert("Location Error", "Could not determine current location.");
      return;
    }


    const formData = new FormData();

    formData.append("shopCode", shopCode);
    formData.append("outletName", outletName);
    formData.append("ownerName", contactPerson);
    formData.append("mobileNo", mobile);
    formData.append("address1", address1);
    formData.append("address2", address2);
    formData.append("address3", address3);
    formData.append("outletCategoryId", category || "0");
    formData.append("outletSequence", outletSequence || "0");
    formData.append("displayOrder", displayOrder || "0");
    if (latitude) formData.append("latitude", String(latitude));
    if (longitude) formData.append("longitude", String(longitude));
    formData.append("isNew", "true");
    formData.append("isApproved", "false");
    formData.append("isClose", "false");
    formData.append("routeId", selectedRoute.id);
    formData.append("routeCode", selectedRoute.routeCode);
    formData.append("rangeId", userLoginResponse.data.rangeId);
    
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
    console.log("Creating Outlet with FormData");
  };

  return (
    <LinearGradient colors={["#ff6666", "#ff0000"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <Text style={styles.title}>Add New Outlet</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Date / Time</Text>
            <TouchableOpacity
              onPress={() => setDate(new Date())}
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
      selectedValue={selectedRoute ? selectedRoute.id : ""}
              onValueChange={(itemValue) => {
                const selected = (Route.routes || []).find(
                  (route: any) => route.id == itemValue
                );
                 setSelectedRoute(selected);
                if (selected) {
               
                }
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select a route" value="" />
              {(Route.routes || []).map((route: any) => (
                <Picker.Item
                  key={route.id}
                  label={route.routeName}
                  value={route.id}
                />
              ))}
            </Picker>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Add After (Optional)</Text>
            <Picker
              selectedValue={selectedAfter}
              onValueChange={(itemValue) => setSelectedAfter(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Outlet" value="" />
              <Picker.Item label="Outlet 1" value="outlet1" />
              <Picker.Item label="Outlet 2" value="outlet2" />
            </Picker>
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
            <TextInput
            style={styles.input}
            placeholder="Enter Shop Code"
            value={shopCode}
            onChangeText={setShopCode}
          />
          <TextInput
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
          />

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
              <Picker.Item label="Grocery" value="1" />
              <Picker.Item label="Pharmacy" value="2" />
              <Picker.Item label="Bakery" value="3" />
            </Picker>
          </View>

           <TextInput
            style={styles.input}
            placeholder="Enter Vat No."
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
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.createText}>Create</Text>}
            </TouchableOpacity>
          </View>
        </Card>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { padding: 16 },
  card: { padding: 16, borderRadius: 8, marginTop: 35 },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  field: { marginBottom: 16 },
  label: { fontSize: 16, marginBottom: 8 },
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
});

export default OutletAdd;
