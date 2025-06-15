import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Survey from '../SurveyScreen/Survey';
import HomeScreen from '../HomeScreen';
import HomeSurvery from './HomeSurvey';

type RootStackParamList = {
  Survey: undefined;
  HomeSurvey:undefined
  Home: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Survey"
          component={Survey}
        />
        <Stack.Screen
          name="HomeSurvey"
          component={HomeSurvery}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
