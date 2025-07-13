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
import HomeSurvey from "../screens/SurveyScreen/HomeSurvey";
import InvoiceSummaryScreen from "../screens/ReportScreen/InvoiceSummary";
import StockLevelReportScreen from "../screens/ReportScreen/StockLevel";

export type InvoiceItem = {
  itemName: string;
  unitPrice: string;
  quantity: string;
  specialDiscount: string;
  freeIssue: string;
  goodReturnQty: string;
  goodReturnFreeQty: string;
  marketReturnQty: string;
  marketReturnFreeQty: string;
  lineTotal: string;
  unitPriceGR: string;
  unitPriceMR: string;
  category: string;
};

// Define all route names exactly as they will be used in <Stack.Screen name="...">
export type RootStackParamList = {
    Splash: undefined;
    AuthLoading: undefined;
    Login: undefined;
    start: undefined;
    Home: undefined;
    HomeScreen: undefined;
    CreateInvoice: { customerId?: string; invoiceType?: string; invoiceMode?: string } | undefined;
    CreateInvoiceScreen: { customerId: string; customerName: string; invoiceType: string; invoiceMode: string };
    ItemDetailsScreen: { customerName: string; item: Partial<InvoiceItem> & { itemName: string } };
    InvoiceFinish: { invoiceData: any };
    Stock:undefined;
    OutletAdd:undefined;
    UpdateOutlet:undefined;
    HomeReport:undefined;
    Survey:undefined;
    HomeSurvey:undefined;
    InvoiceSummary: undefined;
    StockLevel: undefined;


};

const Stack = createStackNavigator<RootStackParamList>();

const AuthNavigator = () => (
  <Stack.Navigator initialRouteName="start" screenOptions={{ headerShown: false, gestureEnabled: false }}>
    <Stack.Screen name="AuthLoading" component={AuthLoading} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="start" component={DayStart} />
    <Stack.Screen name="Home" component={BottomTabNavigation} />
    <Stack.Screen name="HomeScreen" component={HomeScreen}   />
    <Stack.Screen name="CreateInvoice" component={CreateInvoice} />
    <Stack.Screen name="CreateInvoiceScreen" component={CreateInvoiceScreen} />
    <Stack.Screen name="ItemDetailsScreen" component={ItemDetailsScreen} />
    <Stack.Screen name="InvoiceFinish" component={InvoiceFinish}/>
     <Stack.Screen name="Stock" component={Stock}/>
      <Stack.Screen name="OutletAdd" component={OutletAdd}/>
      <Stack.Screen name="UpdateOutlet" component={UpdateOutlet}/>
      <Stack.Screen name="HomeReport" component={HomeReport}/>
     <Stack.Screen name="Survey" component={Survey}/>
      <Stack.Screen name="HomeSurvey" component={HomeSurvey}/>
      <Stack.Screen name="InvoiceSummary" component={InvoiceSummaryScreen} options={{ headerShown: true, title: 'Invoice Summary' }} />
      <Stack.Screen name="StockLevel" component={StockLevelReportScreen} options={{ headerShown: true, title: 'Stock Level Report' }} />
  </Stack.Navigator>
);

export default AuthNavigator;
