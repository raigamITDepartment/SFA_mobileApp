import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  BackHandler
} from "react-native";

import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import * as Location from "expo-location";
import { useAppDispatch, useAppSelector } from "../store/Hooks";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { logoutUser } from "../actions/UserAction";
// import useBackToHome from '../store/UseBackToHome';

type RootStackParamList = {
  HomeScreen: undefined;
  Login: undefined;
  start: undefined;
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "HomeScreen">;

const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const dispatch = useAppDispatch();
  const userLoginResponse = useAppSelector((state) => state.login.user);

  const [monthlyTarget, setMonthlyTarget] = useState("");
  const [achievementValue, setAchievementValue] = useState("");
  const [achievementPercentage, setAchievementPercentage] = useState("");
  const [pcTarget, setPcTarget] = useState("");
  const [pcAchievement, setPcAchievement] = useState("");
  const [pcUnproductive, setPcUnproductive] = useState("");
  const [activeOutlets, setActiveOutlets] = useState("");
  const [closedOutlets, setClosedOutlets] = useState("");
  const [visitedOutlets, setVisitedOutlets] = useState("");
  const [dropdownValue, setDropdownValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const dropdownData = [
    { label: "Item 1", value: "1" },
    { label: "Item 2", value: "2" },
    { label: "Item 3", value: "3" },
    { label: "Item 4", value: "4" },
  ];

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("HomeScreen");
      return true;
    };

    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [navigation]);

  const handleLogout = () => {
    Alert.alert("Confirm Logout", "Are you sure you want to logout and end the day?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
              Alert.alert("Permission Denied", "Location access is required.");
              return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            console.log("Current Location:", latitude, longitude);

            await dispatch(logoutUser({ latitude, longitude, dayend: 1 }));
            navigation.replace("Login"); // Use lowercase "login" if your screen name is defined like that
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Something went wrong while logging out.");
          }
        },
        style: "destructive",
      },
    ]);
  };

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
        <Text style={styles.input}>User Name: {userLoginResponse?.data?.userName}</Text>
        <Text style={styles.input}>Hello: {userLoginResponse?.data?.personalName}</Text>
        <Text style={styles.input}>Territory: {userLoginResponse?.data?.territoryName}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Feather name="target" size={24} color="black" />
          <Text style={styles.cardTitle}> Target</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Territory Target:"
          value={monthlyTarget}
          onChangeText={setMonthlyTarget}
        />
        <TextInput
          style={styles.input}
          placeholder="My Achievement Value:"
          value={achievementValue}
          onChangeText={setAchievementValue}
        />
        <TextInput
          style={styles.input}
          placeholder="My Achievement Percentage:"
          value={achievementPercentage}
          onChangeText={setAchievementPercentage}
        />
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Feather name="target" size={24} color="black" />
          <Text style={styles.cardTitle}> PC Target</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Territory PC Target:"
          value={pcTarget}
          onChangeText={setPcTarget}
        />
        <TextInput
          style={styles.input}
          placeholder="My Achieved PC Target:"
          value={pcAchievement}
          onChangeText={setPcAchievement}
        />
        <TextInput
          style={styles.input}
          placeholder="My Unproductive calls:"
          value={pcUnproductive}
          onChangeText={setPcUnproductive}
        />
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Entypo name="shop" size={24} color="black" />
          <Text style={styles.cardTitle}>Outlets</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Active Outlets"
          value={activeOutlets}
          onChangeText={setActiveOutlets}
        />
        <TextInput
          style={styles.input}
          placeholder="Closed Outlets"
          value={closedOutlets}
          onChangeText={setClosedOutlets}
        />
        <TextInput
          style={styles.input}
          placeholder="Visited Outlets"
          value={visitedOutlets}
          onChangeText={setVisitedOutlets}
        />
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
    backgroundColor: "white",
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
