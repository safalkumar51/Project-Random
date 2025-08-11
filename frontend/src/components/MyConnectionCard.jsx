import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions, Alert } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { removeConnection } from '../redux/slices/connectionsSlice';
import { setOtherProfileStatus } from '../redux/slices/otherProfileSlice'; // NEW import

const { width } = Dimensions.get('window');

const MyConnectionCard = ({ name, profileImage, time, senderId }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const getProfileHandler = () => {
        navigation.navigate("OtherProfileScreen", { status: "connected", otherId: senderId, requestId: "" });
    };

    const removeHandler = async () => {
        try {
            const authToken = await AsyncStorage.getItem('authToken');
            if (!authToken) {
                navigation.replace("LoginScreen");
                return;
            }

            const response = await axios.post('http://10.0.2.2:4167/connection/remove', {
                senderId
            }, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                }
            });

            if (response.data.success) {
                Alert.alert(response.data.message);

                // Update Redux
                dispatch(removeConnection(senderId));
                dispatch(setOtherProfileStatus("none")); // Instant sync for profile view

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
    };

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
        </View>
    );
};

export default MyConnectionCard;
