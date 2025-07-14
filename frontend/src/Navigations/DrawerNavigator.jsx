import { StyleSheet } from 'react-native';
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import CustomDrawerContent from '../components/customDrawerContent';
import DeleteAccountScreen from '../screens/DrawerScreens/DeleteAccountScreen'; //new
import PersonalDetailsScreen from '../screens/DrawerScreens/PersonalDetailsScreen'; //new

import AboutScreen from '../screens/DrawerScreens/AboutScreen';
import EditProfileScreen from '../screens/DrawerScreens/EditProfileScreen';
import HelpScreen from '../screens/DrawerScreens/HelpScreen';
import MyConnectionScreen from '../screens/DrawerScreens/MyConnectionsScreen';
import SettingsScreen from '../screens/DrawerScreens/SettingsScreen';
import LogoutScreen from '../screens/DrawerScreens/LogOutScreen';
import MainTabNavigator from './MainTabNavigator';
import TermsScreen from '../screens/DrawerScreens/TermsScreen';




const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: true,
                drawerPosition: 'right',
                drawerStyle: {
                    width: 250, 
                },
            }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
            <Drawer.Screen name="Home" component={MainTabNavigator} />
            <Drawer.Screen name="My Connections" component={MyConnectionScreen} />
            <Drawer.Screen name="Edit Profile" component={EditProfileScreen} />
            <Drawer.Screen name="Terms" component={TermsScreen} />
            <Drawer.Screen name="Help & Support" component={HelpScreen} />
            
            <Drawer.Screen name="Personal Details" component={PersonalDetailsScreen} />
            <Drawer.Screen name="Delete Account" component={DeleteAccountScreen} />

            <Drawer.Screen name="About" component={AboutScreen} />
            <Drawer.Screen name="Setting" component={SettingsScreen} />
            <Drawer.Screen name="Logout" component={LogoutScreen} />
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;