import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import UDImages from "../UDImages";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as Location from 'expo-location';
import { DayStartUser } from "../actions/UserAction";
import { useAppDispatch ,useAppSelector} from "@/store/Hooks";


type DayStartScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};
const DayStart = ({ navigation }: DayStartScreenProps) => {
    const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  // const handleSubmitPress = () => {
  //   // Navigate to the home screen
  //   navigation.navigate("Home");
  // };
 const userLoginResponse = useAppSelector((state) => state.login.user);

 const handleDayStart = () => {
    Alert.alert(
      "Confirm Day Start",
      "Are you sure you want to start the day?",
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
              console.log("Current Location Day Start:", latitude, longitude);

              const userId = userLoginResponse?.data?.userId;
              if (!userId) {
                Alert.alert("Error", "User ID not found. Cannot start day.");
                return;
              }

              await dispatch(DayStartUser({ userId, latitude, longitude, gpsStatus: true }));
              navigation.replace("Home"); // Use lowercase "login" if your screen name is defined like that
            } catch (error) {
              console.error("Logout error:", error);
              Alert.alert("Error", "Something went wrong while logging out.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  


  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.h1}>Welcome Raigam Marketing</Text>
      </View>
      <View style={styles.middleContainer}>
        <Text style={styles.h2}>
          Start your day with a fresh mind and positive energy!
        </Text>
        <Image source={UDImages.splashLogo} style={styles.image} />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={1}
            onPress={handleDayStart} disabled={loading}
           // onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.buttonTextStyle}>Day Start</Text>
              {loading && <ActivityIndicator />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  topContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  middleContainer: {
    flex: 3,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  bottomContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "90%",
    margin: 20,
    padding: 10,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  h1: {
    fontSize: 24,
    fontWeight: "bold",
  },
  h2: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  buttonStyle: {
    backgroundColor: "#0b1492",
    borderWidth: 0,
    color: "#5e0101",
    borderColor: "#3b19b6",
    height: 40,
    alignItems: "center",
    borderRadius: 60,
    paddingHorizontal: 0,
    marginTop: 0,
    marginBottom: 95,
    width: "100%",
    justifyContent: "center",
    shadowColor: "#000",
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    fontSize: 16,
  },
});

export default DayStart;
