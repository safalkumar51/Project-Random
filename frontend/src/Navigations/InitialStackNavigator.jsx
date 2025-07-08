import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OnboardingScreen from '../screens/InitialScreens/OnboardingScreen';
import LoginScreen from '../screens/InitialScreens/LoginScreen';
import SignupScreen from '../screens/InitialScreens/SignupScreen';
import ForgotPasswordScreen from '../screens/InitialScreens/ForgotPasswordScreen';
import OtpScreen from '../screens/InitialScreens/OtpScreen';
import DrawerNavigator from './DrawerNavigator';

import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const InitialStackNavigator = ({ isFirstLaunch }) => {

    const [authToken, setAuthToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuthToken = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                setAuthToken(token);
            } catch (err) {
                console.error('Error fetching auth token:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAuthToken();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Loading...</Text>
            </View>
        );
    } // or show a loading screen

    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={isFirstLaunch ? 'OnboardingScreen' : authToken ? 'MainTab' : 'LoginScreen'}
        >
            <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} />
            <Stack.Screen name="SignupScreen" component={SignupScreen} />
            <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
            <Stack.Screen name="OtpScreen" component={OtpScreen} />
            <Stack.Screen name="MainTab" component={DrawerNavigator} />
        </Stack.Navigator>
    )
}

export default InitialStackNavigator

const styles = StyleSheet.create({})