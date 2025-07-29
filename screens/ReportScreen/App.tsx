import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CreateInvoice from '../InvoiceScreen/Createbill/CreateInvoice';
import CreateInvoiceScreen from '../InvoiceScreen/Createbill/CreateInvoiceScreen';
import InvoiceFinish from '../InvoiceScreen/Createbill/InvoiceFinish';
import ItemDetailsScreen from '../InvoiceScreen/Createbill/ItemDetailsScreen';
import UpproductiveCall from '../InvoiceScreen/Createbill/UpproductiveCall';
import HomeScreen from '../HomeScreen';

type RootStackParamList = {
  CreateInvoice: undefined;
  CreateInvoiceScreen: undefined;
  InvoiceFinish: undefined;
  ItemDetailsScreen: undefined;
  UpproductiveCall: undefined;
  Home: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CreateInvoice">
        <Stack.Screen
          name="CreateInvoice"
          component={CreateInvoice}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateInvoiceScreen"
          component={CreateInvoiceScreen}
        />
        <Stack.Screen name="InvoiceFinish" component={InvoiceFinish} />
        <Stack.Screen name="ItemDetailsScreen" component={ItemDetailsScreen} />
        <Stack.Screen name="UpproductiveCall" component={UpproductiveCall} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
