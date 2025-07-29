import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import OutletAdd from '../OutletScreen/OutletAdd';
import UpdateOutlet from './UpdateOutlet';
import HomeScreen from '../HomeScreen';

type RootStackParamList = {
  OutletAdd: undefined;
  UpdateOutlet: undefined;
  HomeScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomeScreen">
        <Stack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OutletAdd"
          component={OutletAdd}
        />
        <Stack.Screen
          name="UpdateOutlet"
          component={UpdateOutlet}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
