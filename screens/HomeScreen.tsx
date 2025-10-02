import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  BackHandler,
} from "react-native";

import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import * as Location from "expo-location";
import { useAppDispatch, useAppSelector } from "../store/Hooks";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { logoutUser } from "../actions/UserAction";
import { fetchDashboardInfo } from "../actions/DashboardAction";
// import useBackToHome from '../store/UseBackToHome';

type RootStackParamList = {
  HomeScreen: undefined;
  Login: undefined;
  start: undefined;
  AuthLoading: undefined;
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "HomeScreen">;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const dispatch = useAppDispatch();
  const userLoginResponse = useAppSelector((state) => state.login.user);
  const { info: dashboardInfo, loading: dashboardInfoLoading } = useAppSelector((state) => state.dashboardInfo);
  const userId = userLoginResponse?.data?.userId;
  const territoryId = userLoginResponse?.data?.territoryId;
  // const territoryId =  2 // This was the hardcoded value causing the issue

  const [dropdownValue, setDropdownValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [bookingValue, setBookingValue] = useState("");
  const [cancelledValue, setCancelledValue] = useState("");
  const [lateDeliveryBills, setLateDeliveryBills] = useState("");

  const dropdownData = [
    { label: "Item 1", value: "1" },
    { label: "Item 2", value: "2" },
    { label: "Item 3", value: "3" },
    { label: "Item 4", value: "4" },
  ];

  useEffect(() => {
    if (userId && territoryId) {
      dispatch(fetchDashboardInfo({ userId: Number(userId), territoryId: Number(territoryId) }));
    }
  }, [dispatch, userId, territoryId]);

  console.log("Dashboard Info:", userId, territoryId);


  useEffect(() => {
    const backAction = () => {
      navigation.navigate("HomeScreen");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, [navigation]);

  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout and end the day?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              let { status } =
                await Location.requestForegroundPermissionsAsync();
              if (status !== "granted") {
                Alert.alert(
                  "Permission Denied",
                  "Location access is required."
                );
                return;
              }

              let location = await Location.getCurrentPositionAsync({});
              const { latitude, longitude } = location.coords;
              console.log("Current Location:", latitude, longitude);

              const userId = userLoginResponse?.data?.userId;
              if (!userId) {
                Alert.alert("Error", "User ID not found. Cannot log out.");
                return;
              }
              await dispatch(
                logoutUser({ userId, latitude, longitude, isCheckIn: false, isCheckOut : true ,gpsStatus: false})
              );
              navigation.replace("AuthLoading"); // Use lowercase "login" if your screen name is defined like that
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Error", "Something went wrong pleas check your internet connection or GPS ON and try again while logging out.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  // Helper function to format numbers with thousand separators
  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined) {
      return 'N/A';
    }
    return num.toLocaleString('en-LK');
  };

  // Helper function to format currency values
  const formatCurrency = (num: number | null | undefined): string => {
    if (num === null || num === undefined) {
      return 'N/A';
    }
    return `Rs. ${num.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercentage = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return 'N/A';
    return `${num.toFixed(2)}%`;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <TouchableOpacity style={styles.profileIcon} onPress={handleLogout}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Entypo name="log-out" size={24} color="black" />
            <Text style={{ marginLeft: 8, fontSize: 16 }}>Day End</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Welcome</Text>
        <Text style={styles.input}>
          User Name: {userLoginResponse?.data?.userName}
        </Text>
        <Text style={styles.input}>
          Hello: {userLoginResponse?.data?.personalName}
        </Text>
        <Text style={styles.input}>
          Territory: {userLoginResponse?.data?.territoryName}
        </Text>
        <Text style={styles.input}>
          Check-In Time: {dashboardInfoLoading ? '...' : dashboardInfo?.checkInTime ?? 'N/A'}
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Feather name="target" size={24} color="black" />
          <Text style={styles.cardTitle}> Target</Text>
        </View>

        <Text style={styles.input}>Territory Target: {dashboardInfoLoading ? 'Loading...' : formatCurrency(dashboardInfo?.territoryTargetForThisMonth)}</Text>
        <Text style={styles.input}>My Achievement Value: {dashboardInfoLoading ? 'Loading...' : formatCurrency(dashboardInfo?.totalActualValueForThisMonth)}</Text>
        <Text style={styles.input}>My Achievement Percentage: {dashboardInfoLoading ? 'Loading...' : formatPercentage(dashboardInfo?.achievementPercentageForThisMonth)}</Text>

      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Feather name="target" size={24} color="black" />
          <Text style={styles.cardTitle}> PC Target</Text>
        </View>

        <Text style={styles.input}>PC Target: {dashboardInfoLoading ? 'Loading...' : formatNumber(dashboardInfo?.pcTargetForThisMonth)}</Text>
        <Text style={styles.input}>My Achieved PC Target :  {dashboardInfoLoading ? 'Loading...' : formatNumber(dashboardInfo?.achievedPcTargetForThisMonth)}</Text>
        <Text style={styles.input}>My Unproductive calls: {dashboardInfoLoading ? 'Loading...' : formatNumber(dashboardInfo?.unproductiveCallCountForThisMonth)}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Entypo name="shop" size={24} color="black" />
          <Text style={styles.cardTitle}>Outlets</Text>
        </View>

        <Text style={styles.input}>
          Active Outlets: {dashboardInfoLoading ? 'Loading...' : formatNumber(dashboardInfo?.activeOutletCount)}
        </Text>
        <Text style={styles.input}>
          Closed Outlets: {dashboardInfoLoading ? 'Loading...' : formatNumber(dashboardInfo?.inactiveOutletCount)}
        </Text>
        <Text style={styles.input}>
          Visited Outlets (This Month): {dashboardInfoLoading ? 'Loading...' : formatNumber(dashboardInfo?.visitedOutletCountForThisMonth)}
        </Text>
        <Text style={styles.input}>
          Total Visits (This Month): {dashboardInfoLoading ? 'Loading...' : formatNumber(dashboardInfo?.visitCountForThisMonth)}
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Entypo name="shop" size={24} color="black" />
          <Text style={styles.cardTitle}>Invoice</Text>
        </View>
        <Text style={styles.input}>Booking Value: {dashboardInfoLoading ? 'Loading...' : formatCurrency(dashboardInfo?.totalBookingValueForThisMonth)}</Text>
        <Text style={styles.input}>Booking Count: {dashboardInfoLoading ? 'Loading...' : formatNumber(dashboardInfo?.bookingInvoicesCountForThisMonth)}</Text>

        <Text style={styles.input}>Actual Value: {dashboardInfoLoading ? 'Loading...' : formatCurrency(dashboardInfo?.totalActualValueForThisMonth)}</Text>
        <Text style={styles.input}>Actual Total Count : {dashboardInfoLoading ? 'Loading...' : formatNumber(dashboardInfo?.actualInvoicesCountForThisMonth)}</Text>

        <Text style={styles.input}>Cancelled Value: {dashboardInfoLoading ? 'Loading...' : formatCurrency(dashboardInfo?.totalCancelValueForThisMonth)}</Text>
         <Text style={styles.input}>Cancelled Count: {dashboardInfoLoading ? 'Loading...' : formatNumber(dashboardInfo?.cancelInvoicesCountForThisMonth)}</Text>

        <Text style={styles.input}>Late Delivery bills Value: {dashboardInfoLoading ? 'Loading...' : formatCurrency(dashboardInfo?.totalLateDeliveryValueForThisMonth)}</Text>
          <Text style={styles.input}>Late Delivery bills Count: {dashboardInfoLoading ? 'Loading...' : formatNumber(dashboardInfo?.lateDeliveryInvoicesCountForThisMonth)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Category Wise Target</Text>

        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
          data={dropdownData}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? "Select item" : "..."}
          searchPlaceholder="Search..."
          value={dropdownValue}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setDropdownValue(item.value);
            setIsFocus(false);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color={isFocus ? "blue" : "black"}
              name="Safety"
              size={20}
            />
          )}
        />

        <Text style={styles.input}>Item:</Text>
        <Text style={styles.input}>Pkt:</Text>
        <Text style={styles.input}>Value:</Text>
        <Text style={styles.input}>Percentage:</Text>
        <Text style={styles.input}>Average Pc:</Text>
        <Text style={styles.input}>Heart Count:</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ff0000",
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginTop: 22,
  },
  title: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  profileIcon: {
    alignItems: "center",
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
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginTop: 8,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  icon: {
    marginRight: 5,
  },
});

export default HomeScreen;
