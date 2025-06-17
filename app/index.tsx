import React from 'react';
import { useFonts } from "expo-font";
import { ActivityIndicator, View } from "react-native";
//import { SafeAreaProvider } from 'react-native-safe-area-context';


import AuthNavigator from '../navigation/AuthNavigator';

import { Provider } from "react-redux";
import  store  from "../store"; // adjust path if needed
// or your main navigation component

export default function App() {
  const [fontsLoaded] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Bold": require("../assets/fonts/Montserrat-Bold.ttf"),
    "Montserrat-SemiBold": require("../assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Medium": require("../assets/fonts/Montserrat-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
      <Provider store={store}>
     
   <AuthNavigator/>
   
     
    </Provider>
  );
}
