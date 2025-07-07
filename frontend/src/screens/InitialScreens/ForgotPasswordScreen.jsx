import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

import axios from 'axios';

import { SafeAreaView } from 'react-native-safe-area-context';

import FormInput from '../../components/FormInput';
import FormButton from '../../components/FormButton';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState();

    const forgotPasswordHandler = async () => {

        if (!email) {
            Alert.alert("All fields are mandatory.");
            return;
        }

        if (!email.endsWith("@hbtu.ac.in")) {
            Alert.alert("Only college email allowed.");
            return;
        }

        try {
            const response = await axios.post('http://10.0.2.2:4167/user/forgotpassword/otp', {
                email,
            });

            if (response.data.success) {
                navigation.navigate("OtpScreen", {
                    email,
                    counter: 0
                });
            }
            else {
                Alert.alert("Something Went Wrong!");
                console.log(response.data.message);
            }

        } catch (err) {
            Alert.alert('Forgot Password Failed!!',
                err.response?.data?.message || 'Error'
            );
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.Container}>
                <Text>Add Random app image or logo</Text>
                <Text style={styles.HeaderTxt}>Forgot password!</Text>
                <FormInput
                    iconType='Feather'
                    iconName='user'
                    iconSize={17}
                    placeholderText={'University Mail ID'}
                    labelValue={email}
                    onChangeText={(email) => setEmail(email)}
                    keyboardType='email-address'
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <FormButton
                    buttonTitle='Send OTP'
                    onPress={forgotPasswordHandler}
                />
                <View style={styles.SignInContainer}>
                    <Text style={styles.SignInTxt}>
                        Already have an Account?
                    </Text>
                    <TouchableOpacity>
                        <Text style={[styles.SignInTxt, { color: '#2e64e5' }]} onPress={() => { navigation.navigate("LoginScreen") }}>Sign In!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ForgotPasswordScreen

const styles = StyleSheet.create({
    Container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    HeaderTxt: {
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: 'Lato-Regular',
        marginBottom: 10,
    },
    SignInContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginTop: 15,
        gap: 5,
    },
    SignInTxt: {
        fontSize: 14,
        fontFamily: 'Lato-Regular',
    },
})