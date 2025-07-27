import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Switch, NativeModules } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import requestLocationPermissions from '../utils/requestLocationPermissions';

import AsyncStorage from '@react-native-async-storage/async-storage';

const { LocationModule } = NativeModules;

const CustomDrawerContent = (props) => {
    const { navigation } = props;
    const activeRoute = props.state?.routeNames[props.state.index];
    const [isEnabled, setIsEnabled] = useState(false);

    const startLocationTracker = async () => {
        const granted = await requestLocationPermissions();
        const authToken = await AsyncStorage.getItem('authToken');
        if (granted && authToken) {
            LocationModule.startService(authToken);
        }
    }

    const stopLocationTracker = () => {
        console.log('Service Stopped');
        LocationModule.stopService();
    }

    const toggleSwitch = async () => {
        setIsEnabled(previousState => !previousState);
        if (!isEnabled) {
            await startLocationTracker();
        } else {
            stopLocationTracker();
        }
    };

    const DrawerItem = ({ label, icon, onPress, isActive = false, color = '#000' }) => (
        <TouchableOpacity
            style={[styles.item, isActive && styles.activeItem]}
            onPress={onPress}
        >
            <MaterialIcons
                name={icon}
                size={24}
                color={isActive ? '#007AFF' : color}
                style={styles.icon}
            />
            <Text style={[
                styles.text,
                { color: isActive ? '#007AFF' : color, fontWeight: isActive ? 'bold' : 'normal' }
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <DrawerContentScrollView {...props} contentContainerStyle={styles.scroll}>

                {/* Toggle Section */}
                <View style={styles.toggleContainer}>
                    <Text style={styles.toggleText}>Visible</Text>
                    <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isEnabled ? "#2e64e5" : "#f4f3f4"}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>

                {/*<DrawerItem
                    label="Home"
                    icon="home"
                    isActive={activeRoute === 'Home'}
                    onPress={() => navigation.navigate('Home')}
                />*/}
                <DrawerItem
                    label="Edit Profile"
                    icon="edit"
                    isActive={activeRoute === 'Edit Profile'}
                    onPress={() => navigation.navigate('Edit Profile')} />

                <DrawerItem
                    label="My Connections"
                    icon="people-outline"
                    isActive={activeRoute === 'My Connections'}
                    onPress={() => navigation.navigate('My Connections')}/>

                
                {/*<DrawerItem
                    label="Help & Support"
                    icon="help-outline"
                    isActive={activeRoute === 'Help & Support'}
                    onPress={() => navigation.navigate('Help & Support')}
                />

                <DrawerItem
                    label="About"
                    icon="info-outline"
                    isActive={activeRoute === 'About'}
                    onPress={() => navigation.navigate('About')}
                />*/}


                <DrawerItem
                    label="Setting"
                    icon="settings"
                    isActive={activeRoute === 'Setting'}
                    onPress={() => navigation.navigate('Setting')} />
            </DrawerContentScrollView>

            {/* Logout button at the bottom */}
            <View style={styles.logoutContainer}>
                <DrawerItem
                    label="Logout"
                    icon="logout"

                    onPress={() => navigation.navigate('Logout')}
                    color="red"
                />
            </View>
        </SafeAreaView>
    );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
    scroll: {
        paddingHorizontal: 20,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    activeItem: {
        backgroundColor: '#f0f0f0',
        borderRadius: 40,
    },
    icon: {
        marginRight: 16,
    },
    text: {
        fontSize: 18,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    toggleText: {
        fontSize: 20,
        fontWeight: '500',
    },
    logoutContainer: {
        marginLeft: 20,
        marginBottom: 20,
    },
});