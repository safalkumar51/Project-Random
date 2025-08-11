import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';

import axios from 'axios';

import { SafeAreaView } from 'react-native-safe-area-context';

import FormButton from '../../components/FormButton';
import FormInput from '../../components/FormInput';
import baseURL from '../../assets/config';

const LoginScreen = ({ navigation }) => {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const signInHandler = async () => {
        //return navigation.navigate("MainTab");
        if (!email || !password) {
            Alert.alert("All fields are mandatory.");
            return;
        }

        if (!email.endsWith("@hbtu.ac.in")) {
            Alert.alert("Only college email allowed.");
            return;
        }

        if (password.length < 8) {
            Alert.alert("Password must contain alteast 8 characters.");
            return;
        }

        try {
            const response = await axios.post(`${ baseURL }/user/signin/otp`, {
                email,
                password,
            });

            if (response.data.success) {
                navigation.navigate("OtpScreen", {
                    email,
                    counter: 2
                });
            }
            else {
                Alert.alert("Something Went Wrong!");
                console.log(response.data.message);
            }

        } catch (err) {
            Alert.alert('Sign In Failed!!',
                err.response?.data?.message || 'Error'
            );
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.Container}>
                <Text>Add Random app image or logo</Text>
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
                <FormInput
                    iconType='EvilIcons'
                    iconName='lock'
                    iconSize={25}
                    placeholderText={'Password'}
                    labelValue={password}
                    onChangeText={(password) => setPassword(password)}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={true}
                />
                <FormButton
                    buttonTitle='Sign In'
                    onPress={signInHandler}
                />
                <TouchableOpacity style={styles.ForgetBtn}>
                    <Text style={styles.ForgetBtnTxt} onPress={() => { navigation.navigate("ForgotPasswordScreen") }}>Forgot Password?</Text>
                </TouchableOpacity>
                <View style={styles.SignUpContainer}>
                    <Text style={styles.SignUpTxt}>
                        Create a New Account?
                    </Text>
                    <TouchableOpacity>
                        <Text style={[styles.TCtxt, { color: '#2e64e5' }]} onPress={() => { navigation.navigate("SignupScreen") }}>Sign Up!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    Container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    ForgetBtn: {
        marginTop: 15,
        alignItems: 'center',
    },
    ForgetBtnTxt: {
        fontSize: 14,
        color: '#2e64e5',
        fontFamily: 'Lato-Regular',
    },
    SignUpContainer: {
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