import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { enableScreens } from 'react-native-screens';

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';

enableScreens();

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
    </Stack.Navigator>
  )
}

const App = () => {
  React.useEffect(() => {
    // Lock to portrait on mount
    Orientation.lockToPortrait();

    // Optional: Reset on unmount
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  )
}

export default App

const styles = StyleSheet.create({})