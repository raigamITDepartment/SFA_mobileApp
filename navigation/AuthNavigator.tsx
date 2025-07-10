import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import AuthLoading from "../screens/AuthLoading";
import DayStart from "../screens/DayStart";
import CreateInvoice from "../screens/InvoiceScreen/CreateInvoice";
import BottomTabNavigation from "./BottomTabNavigator";
import HomeScreen from "../screens/HomeScreen";
import CreateInvoiceScreen from "../screens/InvoiceScreen/CreateInvoiceScreen";
import ItemDetailsScreen from "../screens/InvoiceScreen/ItemDetailsScreen";
import InvoiceFinish from "../screens/InvoiceScreen/InvoiceFinish";
import Stock from "../screens/Stock";
import OutletAdd from "../screens/OutletScreen/OutletAdd";
import HomeReport from "../screens/ReportScreen/HomeReport";
import UpdateOutlet from "../screens/OutletScreen/UpdateOutlet";
import Survey from "../screens/SurveyScreen/Survey"
import HomeSurvery from "../screens/SurveyScreen/HomeSurvey";

// Define all route names exactly as they will be used in <Stack.Screen name="...">
export type RootStackParamList = {
    Splash: undefined;
    AuthLoading: undefined;
    Login: undefined;
    start: undefined;
    Home: undefined;
    DashBoard: undefined;
    CreateInvoice: { customerId?: string; invoiceType?: string; invoiceMode?: string } | undefined;
    CreateInvoiceScreen: { customerId: string; customerName: string; invoiceType: string; invoiceMode: string };
    ItemDetailsScreen: { customerName: string ;itemName: string };
    InvoiceFinish:undefined;
    Stock:undefined;
    OutletAdd:undefined;
    UpdateOutlet:undefined;
    HomeReport:undefined;
    Survey:undefined;
    HomeSurvey:undefined;
 

};

const Stack = createStackNavigator<RootStackParamList>();

const AuthNavigator = () => (
  <Stack.Navigator initialRouteName="start" screenOptions={{ headerShown: false }}>
   
   
    <Stack.Screen name="AuthLoading" component={AuthLoading} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="start" component={DayStart} />
    <Stack.Screen name="Home" component={BottomTabNavigation} />
    <Stack.Screen name="DashBoard" component={HomeScreen} />
    <Stack.Screen name="CreateInvoice" component={CreateInvoice} />
    <Stack.Screen name="CreateInvoiceScreen" component={CreateInvoiceScreen} />
    <Stack.Screen name="ItemDetailsScreen" component={ItemDetailsScreen} />
    <Stack.Screen name="InvoiceFinish" component={InvoiceFinish}/>
     <Stack.Screen name="Stock" component={Stock}/>
      <Stack.Screen name="OutletAdd" component={OutletAdd}/>
      <Stack.Screen name="UpdateOutlet" component={UpdateOutlet}/>
      <Stack.Screen name="HomeReport" component={HomeReport}/>
     <Stack.Screen name="Survey" component={Survey}/>
      <Stack.Screen name="HomeSurvery" component={HomeSurvery}/>

  </Stack.Navigator>
);

export default AuthNavigator;
