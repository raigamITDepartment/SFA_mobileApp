import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  Linking,
  Platform,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Application from "expo-application";

import { RootStackParamList } from "../navigation/AuthNavigator";
import UDColors from "../constants/UDColors";
import UDImages from "../UDImages";

// ✅ Make sure this URL is accessible (with public or SAS permissions)
const VERSION_CHECK_URL =
  "https://sfasadevsea001.blob.core.windows.net/sfa-app-version-check/version.json";

type AuthLoadingProps = {
  navigation: StackNavigationProp<RootStackParamList, "AuthLoading">;
};

const AuthLoading: React.FC<AuthLoadingProps> = ({ navigation }) => {
  const [status, setStatus] = useState("Checking for updates...");

  const currentVersion = Application.nativeApplicationVersion;
  const currentBuild = Application.nativeBuildVersion
    ? parseInt(Application.nativeBuildVersion, 10)
    : 0;

  useEffect(() => {
    const checkAppVersion = async () => {
      try {
        setStatus("Connecting to update server...");
        const response = await fetch(VERSION_CHECK_URL);
        const rawText = await response.text();

        const data = JSON.parse(rawText);
        const platformData = Platform.OS === "ios" ? data.ios : data.android;

        console.log("📱 Current Build:", currentBuild);
        console.log("🆕 Latest Build:", platformData.versionCode);

        if (currentBuild < platformData.versionCode) {
          setStatus("Update required...");

          if (platformData.mandatory) {
            Alert.alert(
              "Update Required",
              `A new version (${platformData.versionName}) is required. Please update to continue.`,
              [
                {
                  text: "Update Now",
                  onPress: () => Linking.openURL(platformData.url),
                },
              ],
              { cancelable: false }
            );
          } else {
            Alert.alert(
              "Update Available",
              `A new version (${platformData.versionName}) is available.`,
              [
                
                {
                  text: "Update",
                  onPress: () => Linking.openURL(platformData.url),
                },
              ],
              {
                cancelable: true,
                onDismiss: () => navigation.replace("Login"),
              }
            );
          }
        } else {
          setStatus("Latest version installed. Redirecting...");
          setTimeout(() => {
            navigation.replace("Login");
          }, 1000); // optional delay so user sees the status
        }
      } catch (error) {
        console.error("❌ Version check failed:", error);
        setStatus("Failed to check version. Proceeding to login...");
        setTimeout(() => {
          navigation.replace("Login");
        }, 1500);
      }
    };

    const timer = setTimeout(checkAppVersion, 1500); // slight delay before checking
    return () => clearTimeout(timer);
  }, [navigation, currentBuild]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={UDImages.splashLogo}
          style={{ height: 150 }}
          resizeMode="contain"
        />
      </View>
      <View style={styles.versionContainer}>
        <Text style={styles.statusText}>{status}</Text>
        <Text style={styles.versionText}>{`Version ${currentVersion}`}</Text>
      </View>
    </View>
  );
};

export default AuthLoading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C056D",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    flex: 2,
    justifyContent: "flex-end",
  },
  statusText: {
    fontSize: 16,
    color: UDColors.secondry,
    marginBottom: 10,
  },
  versionText: {
    fontSize: 14,
    color: UDColors.secondry,
  },
  versionContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 20,
    alignItems: "center",
    padding: 30,
  },
});
