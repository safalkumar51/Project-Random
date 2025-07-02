import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OnboardingScreen from '../screens/InitialScreens/OnboardingScreen';
import LoginScreen from '../screens/InitialScreens/LoginScreen';
import SignupScreen from '../screens/InitialScreens/SignupScreen';
import ForgotPasswordScreen from '../screens/InitialScreens/ForgotPasswordScreen';
import MainTabNavigator from './MainTabNavigator';

const Stack = createNativeStackNavigator();

const InitialStackNavigator = ({ isFirstLaunch }) => {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={isFirstLaunch ? 'OnboardingScreen' : 'LoginScreen'}
        >
            <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignupScreen" component={SignupScreen} />
            <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
            <Stack.Screen name="MainTab" component={MainTabNavigator} />
        </Stack.Navigator>
    )
}

export default InitialStackNavigator

const styles = StyleSheet.create({})