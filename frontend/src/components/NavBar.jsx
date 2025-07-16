import { StyleSheet, Text, View, TouchableOpacity, Animated, Dimensions } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const NavBar = ({ scrollY }) => {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    return (
        <Animated.View 
            style={[ styles.navBar,
                {
                    paddingTop: insets.top,
                    transform: [{ translateY: scrollY }]
                }
            ]}
        >
            {/* App Name / Logo */}
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Text style={styles.appTitle}>RANDOM</Text>
            </TouchableOpacity>

            {/* Right-side buttons */}
            <View style={styles.iconRow}>
                {/* Add Post Button */}
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('AddPost')}>
                    <MaterialIcons name="add-circle-outline" size={28} color="#222" />
                </TouchableOpacity>

                {/* Menu Button */}
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.openDrawer()}>
                    <MaterialIcons name="dehaze" size={28} color="#222" />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

export default NavBar;

const styles = StyleSheet.create({
    navBar: {
        position: 'absolute',
        zIndex: 10,
        height: 60,
        width: width,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        marginBottom: 10,
    },
    appTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
    },
    iconRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginLeft: 16,
    },
});