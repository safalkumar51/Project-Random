import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/AppScreens/HomeScreen';
import ChatScreen from '../screens/AppScreens/ChatScreen';
import ProfileScreen from '../screens/AppScreens/ProfileScreen';
import AlertScreen from '../screens/AppScreens/AlertScreen';

import Icon from 'react-native-vector-icons/FontAwesome';



const Tab = createBottomTabNavigator();
const MainTabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size }) => {
                let iconName;
                if (route.name === 'Home') iconName = 'home';
                else if (route.name === 'Search') iconName = 'search';
                else if (route.name === 'Profile') iconName = 'user';
                else if (route.name === 'Chat') iconName = 'comments';
                else if (route.name === 'Activity') iconName = 'heart';

                return <Icon name={iconName} size={size} color={color} />;
            },
        })}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Chat" component={ChatScreen} />
            <Tab.Screen name="Activity" component={AlertScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />

        </Tab.Navigator>
    )
}

export default MainTabNavigator

const styles = StyleSheet.create({})