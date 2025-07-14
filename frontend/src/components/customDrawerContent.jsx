import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CustomDrawerContent = (props) => {
    const { navigation } = props;
    const activeRoute = props.state?.routeNames[props.state.index];

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
    logoutContainer: {
        marginLeft: 20,
        marginBottom: 20,
    },
});