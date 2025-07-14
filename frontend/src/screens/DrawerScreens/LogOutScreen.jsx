import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const LogOutScreen = () => {
    const navigation = useNavigation();
    useEffect(() => {
        const logout = async () => {
            try {
                const authToken = await AsyncStorage.getItem('authToken');
                if (!authToken) {
                    navigation.replace('LoginScreen');
                    return;
                }

                const response = await axios.post('http://10.0.2.2:4167/user/signout', {}, {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    }
                });

                if (response.data.success) {
                    await AsyncStorage.removeItem('authToken');
                    navigation.replace("LoginScreen");
                } else {
                    console.error(response.data.message);
                    if (response.data.message === 'Log In Required!'){
                        await AsyncStorage.removeItem('authToken');
                        navigation.replace("LoginScreen");
                    }
                }

            } catch (err) {
                console.error('Sign Out Error:', err);
            }
        }

        //logout();
    }, []);

    return null;
}

export default LogOutScreen

const styles = StyleSheet.create({})