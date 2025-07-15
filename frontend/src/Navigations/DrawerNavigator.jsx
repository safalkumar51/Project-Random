import { StyleSheet } from 'react-native';
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import CustomDrawerContent from '../components/customDrawerContent';

import AboutScreen from '../screens/DrawerScreens/AboutScreen';
import EditProfileScreen from '../screens/DrawerScreens/EditProfileScreen';
import HelpScreen from '../screens/DrawerScreens/HelpScreen';
import MyConnectionScreen from '../screens/DrawerScreens/MyConnectionsScreen';
import SettingScreen from '../screens/DrawerScreens/SettingsScreen';
import LogoutScreen from '../screens/DrawerScreens/LogOutScreen';
import MainTabNavigator from './MainTabNavigator';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerPosition: 'right',
                drawerStyle: {
                    width: 250, // ✅ Reduced width
                },
            }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
            <Drawer.Screen name="Home" component={MainTabNavigator} />
            <Drawer.Screen name="My Connections" component={MyConnectionScreen} />
            <Drawer.Screen name="Edit Profile" component={EditProfileScreen} />
            <Drawer.Screen name="Help & Support" component={HelpScreen} />
            <Drawer.Screen name="About" component={AboutScreen} />
            <Drawer.Screen name="Setting" component={SettingScreen} />
            <Drawer.Screen name="Logout" component={LogoutScreen} />
        </Drawer.Navigator>
    );
};

export default DrawerNavigator;