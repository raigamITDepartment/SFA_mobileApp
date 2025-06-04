import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import AuthLoading from "../screens/AuthLoading";
import DayStart from "@/screens/DayStart";
import CreateInvoice from "@/screens/CreateInvoice";
import BottomTabNavigation from "./BottomTabNavigator";
import HomeScreen from "@/screens/HomeScreen";


export type RootStackParamList = {
    Splash: undefined;
    AuthLoading: undefined;
    Login: undefined;
    start: undefined;
    Home: undefined;
    InvoiceCr: undefined;
    DashBoard: undefined;
    // other routes...
};

const Stack = createStackNavigator<RootStackParamList>();

const AuthNavigator = () => (
  <Stack.Navigator initialRouteName="AuthLoading" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AuthLoading" component={AuthLoading} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="start" component={DayStart} />
    <Stack.Screen name="Home" component={BottomTabNavigation} />
    <Stack.Screen name="DashBoard" component={HomeScreen} />
    <Stack.Screen name="InvoiceCr" component={CreateInvoice} />
  </Stack.Navigator>
);

export default AuthNavigator;
