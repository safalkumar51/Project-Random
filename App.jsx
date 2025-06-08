import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { enableScreens } from 'react-native-screens';

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignupScreen from './src/screens/SignupScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

enableScreens();

const Stack = createNativeStackNavigator();

const App = () => {
  React.useEffect(() => {
    // Lock to portrait on mount
    Orientation.lockToPortrait();

    // Optional: Reset on unmount
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('@onboarding_completed');
      if (value === null) {
        // Onboarding not completed yet
        setIsFirstLaunch(true);
        await AsyncStorage.setItem('@onboarding_completed', 'true');
      } else {
        setIsFirstLaunch(false);
      }
    } catch (error) {
      console.error('Error checking onboarding:', error);
      setIsFirstLaunch(false); // Fallback to main app
    }
  };

  if (isFirstLaunch === null) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstLaunch ? (
          <>
            <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignupScreen" component={SignupScreen} />
            <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App

const styles = StyleSheet.create({})