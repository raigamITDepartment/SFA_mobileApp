import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import AuthLoading from "../screens/AuthLoading";
import DayStart from "../screens/DayStart";
import CreateInvoice from "../screens/InvoiceScreen/Createbill/CreateInvoice";
import BottomTabNavigation from "./BottomTabNavigator";
import HomeScreen from "../screens/HomeScreen";
import CreateInvoiceScreen from "../screens/InvoiceScreen/Createbill/CreateInvoiceScreen";
import ItemDetailsScreen from "../screens/InvoiceScreen/Createbill/ItemDetailsScreen";
import UpproductiveCall from "../screens/InvoiceScreen/Createbill/UpproductiveCall";
import InvoiceFinish from "../screens/InvoiceScreen/Createbill/InvoiceFinish";

import OutletAdd from "../screens/OutletScreen/OutletAdd";
import HomeReport from "../screens/ReportScreen/HomeReport";
import UpdateOutlet from "../screens/OutletScreen/UpdateOutlet";
import Survey from "../screens/SurveyScreen/Survey"
import HomeSurvey from "../screens/SurveyScreen/HomeSurvey";
import InvoiceSummaryScreen from "../screens/ReportScreen/InvoiceSummary";
import StockLevelReportScreen from "../screens/ReportScreen/StockLevel";
import ViewLastBillScreen from "../screens/InvoiceScreen/Createbill/ViewLastBillScreen";
import HomeInvoice from "../screens/InvoiceScreen/HomeInvoice";
import InvoiceEditScreen from "../screens/InvoiceScreen/EditeBill/InvoiceEditScreen";
import InvoiceItemEditScreen from "../screens/InvoiceScreen/EditeBill/InvoiceItemEditScreen";
import ReverseInvoiceScreen from "../screens/InvoiceScreen/EditeBill/ReverseInvoiceScreen";

export type InvoiceItem = {
  itemName: string;
  itemId: number;
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
    CreateInvoice: { routeId?: string; customerId?: string; invoiceType?: string; invoiceMode?: string } | undefined;
    CreateInvoiceScreen: { routeId: string; customerId: string; customerName: string; invoiceType: string; invoiceMode: string };
    ItemDetailsScreen: { customerName: string; item: Partial<InvoiceItem> & { itemName: string; itemId: number } };
    InvoiceFinish: { invoiceData: any };
    Stock:undefined;
    OutletAdd:undefined;
    UpdateOutlet:undefined;
    HomeReport:undefined;
    Survey:undefined;
    HomeSurvey:undefined;
    InvoiceSummary: undefined;
    StockLevel: undefined;
    ViewLastBillScreen: { routeId: string; customerId: string; customerName: string; invoiceType: string; invoiceMode: string };
    HomeInvoice: undefined;
    InvoiceEditScreen: undefined;
    InvoiceItemEditScreen: { invoiceData: any };
    ReverseInvoiceScreen: { invoiceId: string; customerName: string };
    UpproductiveCall: undefined;


};

const Stack = createStackNavigator<RootStackParamList>();

const AuthNavigator = () => (
  <Stack.Navigator initialRouteName="AuthLoading" screenOptions={{ headerShown: false, gestureEnabled: false }}>
    <Stack.Screen name="AuthLoading" component={AuthLoading} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="start" component={DayStart} />
    <Stack.Screen name="Home" component={BottomTabNavigation} />
    <Stack.Screen name="HomeScreen" component={HomeScreen}   />
    <Stack.Screen name="CreateInvoice" component={CreateInvoice} />
    <Stack.Screen name="UpproductiveCall" component={UpproductiveCall} />
    <Stack.Screen name="CreateInvoiceScreen" component={CreateInvoiceScreen} />
    <Stack.Screen name="ItemDetailsScreen" component={ItemDetailsScreen} />
    <Stack.Screen name="InvoiceFinish" component={InvoiceFinish}/>

      <Stack.Screen name="OutletAdd" component={OutletAdd}/>
      <Stack.Screen name="UpdateOutlet" component={UpdateOutlet}/>
      <Stack.Screen name="HomeReport" component={HomeReport}/>
     <Stack.Screen name="Survey" component={Survey}/>
      <Stack.Screen name="HomeSurvey" component={HomeSurvey}/>
      <Stack.Screen name="InvoiceSummary" component={InvoiceSummaryScreen} options={{ headerShown: true, title: 'Invoice Summary' }} />
      <Stack.Screen name="StockLevel" component={StockLevelReportScreen} options={{ headerShown: true, title: 'Stock Level Report' }} />
      <Stack.Screen name="ViewLastBillScreen" component={ViewLastBillScreen} />
      <Stack.Screen name="HomeInvoice" component={HomeInvoice} />
       <Stack.Screen name="InvoiceEditScreen" component={InvoiceEditScreen} />
       <Stack.Screen name="InvoiceItemEditScreen" component={InvoiceItemEditScreen} />
       <Stack.Screen name="ReverseInvoiceScreen" component={ReverseInvoiceScreen} />

  </Stack.Navigator>
);

export default AuthNavigator;
