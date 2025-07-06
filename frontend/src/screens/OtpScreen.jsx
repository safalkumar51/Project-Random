import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import axios from 'axios';

import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import setToken from '../utils/setAuthToken';

const OTP_LENGTH = 6;

const OtpScreen = ({ navigation, route }) => {
    const { email, counter } = route.params;
    const [OTP, setOtp] = useState(Array(OTP_LENGTH).fill(''));
    const inputs = useRef([]);
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    const [count, setCount] = useState(60);

    useEffect(() => {
        if (count === 0) return;

        const timer = setInterval(() => {
            setCount(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [count]);

    const handleChange = (text, index) => {
        if (isNaN(text)) return;

        const newOtp = [...OTP];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < OTP_LENGTH - 1) {
            inputs.current[index + 1].focus();
        }
    };

    const handleBackspace = (key, index) => {
        if (key === 'Backspace' && OTP[index] === '' && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const otpValidate = async () => {
        const otp = OTP.join('');

        if (counter === 0) {

            if (!otp || !password || !confirmPassword) {
                Alert.alert("All fields are mandatory.");
                return;
            }

            if (password !== confirmPassword) {
                Alert.alert(
                    "Sign Up Failed!!",
                    "Enter Password Carefully!"
                );
                return;
            }

            if (password.length < 8) {
                Alert.alert("Password must contain alteast 8 characters.");
                return;
            }

            try {

                const response = await axios.post('http://10.0.2.2:4167/user/forgotpassword/verify', {
                    email,
                    password,
                    otp
                })

                if (response.data.success) {
                    await setToken(response.data.authToken);
                    navigation.replace("MainTab");
                }
                else {
                    Alert.alert(response.data.message)
                }
    

            } catch (err) {
                Alert.alert('OTP Verification Failed!!',
                    err.response?.data?.message || 'Error'
                );
            }
            
        } else if (counter === 1) {

            if (!otp) {
                Alert.alert("All fields are mandatory.");
                return;
            }

            try{

                const response = await axios.post('http://10.0.2.2:4167/user/signup/verify', {
                    email,
                    otp
                })

                if (response.data.success) {
                    await setToken(response.data.authToken);
                    navigation.replace("MainTab");
                }
                else {
                    Alert.alert(response.data.message)
                }

            } catch (err) {
                Alert.alert('OTP Verification Failed!!',
                    err.response?.data?.message || 'Error'
                );
            }

        } else if (counter === 2) {

            if (!otp) {
                Alert.alert("All fields are mandatory.");
                return;
            }

            try {

                const response = await axios.post('http://10.0.2.2:4167/user/signin/verify', {
                    email,
                    otp
                })

                if (response.data.success) {
                    await setToken(response.data.authToken);
                    navigation.replace("MainTab");
                }
                else {
                    Alert.alert(response.data.message)
                }    

            } catch (err) {
                Alert.alert('OTP Verification Failed!!',
                    err.response?.data?.message || 'Error'
                );
            }

        } else {
            Alert.alert('Something Went Wrong!');
        }
    };

    const handleResend = () => {
        setCount(60);
        setOtp(Array(OTP_LENGTH).fill(''));
        inputs.current[0].focus();
    };

    return (
        <View style={styles.otpContainer}>
            <Text style={styles.title}>OTP Verification</Text>

            {!counter && (
                <>
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
                    <FormInput
                        iconType='EvilIcons'
                        iconName='lock'
                        iconSize={25}
                        placeholderText={'Confirm Password'}
                        labelValue={confirmPassword}
                        onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry={true}
                    />
                </>
            )}

            <View style={styles.otpView}>
                {OTP.map((digit, index) => (
                    <TextInput
                        key={index}
                        ref={ref => inputs.current[index] = ref}
                        style={[
                            styles.inputView,
                            { borderColor: digit ? 'royalblue' : 'grey' }
                        ]}
                        keyboardType="number-pad"
                        maxLength={1}
                        placeholder="-"
                        value={digit}
                        onChangeText={text => handleChange(text, index)}
                        onKeyPress={({ nativeEvent }) => handleBackspace(nativeEvent.key, index)}
                    />
                ))}
            </View>

            <View style={styles.resendBtn}>
                <Text
                    style={{
                        fontSize: 15,
                        fontWeight: "700",
                        color: count === 0 ? 'royalblue' : 'grey'
                    }}
                    onPress={count === 0 ? handleResend : null}
                >
                    Resend OTP
                </Text>
                {count > 0 && (
                    <Text style={{ marginLeft: 10, fontSize: 15 }}>{count + ' seconds'}</Text>
                )}
            </View>

            <FormButton
                buttonTitle={'Verify'}
                onPress={otpValidate}
            />
        </View>
    );
};

export default OtpScreen;

const styles = StyleSheet.create({
    otpContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },
    title: {
        alignSelf: 'center',
        marginTop: 100,
        fontWeight: '700',
        fontSize: 28,
        color: '#333',
    },
    otpView: {
        width: "100%",
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 100,
    },
    inputView: {
        width: 50,
        height: 50,
        borderWidth: 3,
        borderRadius: 10,
        marginLeft: 8,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: "700",
    },
    verifyButton: {
        width: "90%",
        height: 50,
        borderRadius: 20,
        alignSelf: 'center',
        justifyContent: "center",
        marginTop: 50,
        alignItems: "center"
    },
    verifyButtonTxt: {
        color: "white",
        fontSize: 20,
        fontWeight: "700"
    },
    resendBtn: {
        flexDirection: "row",
        alignSelf: 'center',
        marginTop: 30,
        marginBottom: 10,
    }
});
