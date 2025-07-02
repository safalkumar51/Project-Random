import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import { enableScreens } from 'react-native-screens';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Orientation from 'react-native-orientation-locker';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { NavigationContainer } from '@react-navigation/native';

import checkOnboardingStatus from './src/utils/checkOnboardingStatus';
import InitialStackNavigator from './src/Navigations/InitialStackNavigator';


enableScreens();

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
    const init = async () => {
      try {
        const result = await checkOnboardingStatus();
        setIsFirstLaunch(result);
      } catch (error) {
        console.error("Error checking onboarding status", error);
        setIsFirstLaunch(false); // default fallback
      }
    };
    init();
  }, []);

  if (isFirstLaunch === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <InitialStackNavigator isFirstLaunch={isFirstLaunch} />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App

const styles = StyleSheet.create({})