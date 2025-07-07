import React, { useEffect } from 'react';
import { useFonts } from "expo-font";
import { ActivityIndicator, View, Alert, Linking, Platform } from "react-native";
import { Provider } from "react-redux";
import store from "../store";
import AuthNavigator from '../navigation/AuthNavigator';

import Constants from 'expo-constants';

const UPDATE_JSON_URL ='https://firebasestorage.googleapis.com/v0/b/sfamobile-1eab9.firebasestorage.app/o/version.json?alt=media&token=f27ff58b-2836-4d2a-bb6e-5c1dea6ac87c';

// Grab the version you set in app.json
function getAppVersion() {
  const cfg = Constants.expoConfig ?? Constants.manifest;
  return cfg?.version ?? '0.0.0';
}

async function checkForUpdate() {
  try {
    const resp = await fetch(UPDATE_JSON_URL);
    const data = await resp.json();

    // bail if it wasn’t valid JSON
    if (!data?.version || !data?.apkUrl) {
      console.log('version.json bad:', data);
      return;
    }

    const latestVersion = data.version;
    const apkUrl       = data.apkUrl;
    const appVersion   = getAppVersion();

    console.log('App Version:', appVersion, 'Latest JSON Version:', latestVersion);

    // Simple string (or semver) compare
    if (appVersion !== latestVersion) {
      Alert.alert(
        'Update Available',
        `You’re running v${appVersion}, but v${latestVersion} is out now. Please update.`,
        [
          {
            text: 'Update',
            onPress: () => {
              if (Platform.OS === 'android') {
                Linking.openURL(apkUrl);
              } else {
                // if you include an App Store URL in your JSON, open it here
                console.log('iOS update URL (if provided):', apkUrl);
              }
            },
          },
        ],
        { cancelable: false }
      );
    }
  } catch (err) {
    console.log('Update check failed:', err);
  }
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
  });

  useEffect(() => {
    checkForUpdate();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator size="large" color="#0000ff"/>
      </View>
    );
  }

  return (
    <Provider store={store}>
      <AuthNavigator />
    </Provider>
  );
}
