import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions, Alert } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import baseURL from '../assets/config';

const { width } = Dimensions.get('window');

const MyConnectionCard = ({ name, profileImage, time, senderId }) => {
    const navigation = useNavigation();

    const getProfileHandler = () => {
        navigation.navigate("OtherProfileScreen", {status: "connected", otherId: senderId, requestId: ""});
    }

    const removeHandler = async () => {
        try {
            const authToken = await AsyncStorage.getItem('authToken');
            if (!authToken) {
                navigation.replace("LoginScreen");
                return;
            }

            const response = await axios.post(`${baseURL}/connection/remove`, {
                senderId
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });

            if (response.data.success) {

                Alert.alert(response.data.message);

            } else {
                console.error(response.data.message);
                if (response.data.message === 'Log In Required!') {
                    await AsyncStorage.removeItem('authToken');
                    navigation.replace("LoginScreen");
                }
            }

        } catch (err) {
            console.error('Error removing:', err);
        }
    }

    return (
        <View style={styles.card}>
            <View style={styles.wrapper}>
                <TouchableOpacity style={styles.userInfo} onPress={getProfileHandler}>
                    <Image style={styles.avatar} source={{ uri: profileImage }} />
                    <View style={styles.nameTime}>
                        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
                        <Text style={styles.time}>{time}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.removeWrapper} onPress={removeHandler}>
                    <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
            </View>
            <View></View>
        </View>
    )
}

export default MyConnectionCard

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#f9f9f9',
        borderRadius: 14,
        marginVertical: 2,
        width: width * 0.95,
        alignSelf: 'center',
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    wrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, // Allow it to take available space
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#ddd',
    },
    nameTime: {
        marginLeft: 12,
        flex: 1,
        overflow: 'hidden',
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    time: {
        fontSize: 12,
        color: '#777',
        marginTop: 2,
    },
    removeWrapper: {
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#e0e0e0',
        marginLeft: 10, // Prevent overlap
        flexShrink: 0,  // Prevent shrinking
    },
    removeText: {
        fontSize: 14,
        fontWeight: '500'
    }
})