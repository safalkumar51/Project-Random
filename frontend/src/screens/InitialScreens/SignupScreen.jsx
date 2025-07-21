import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import React, { useState } from 'react'

import axios from 'axios';

import { SafeAreaView } from 'react-native-safe-area-context';
import FormInput from '../../components/FormInput';
import FormButton from '../../components/FormButton';



const SignupScreen = ({ navigation }) => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    const signUpHandler = async () => {
        
        if(!name || !email || !password){
            Alert.alert("All fields are mandatory.");
            return;
        }

        if (!email.endsWith("@hbtu.ac.in")) {
            Alert.alert("Only college email allowed.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert(
                "Sign Up Failed!!",
                "Enter Password Carefully!"
            );
            return;
        }

        if(password.length<8){
            Alert.alert("Password must contain alteast 8 characters.");
            return;
        }
        
        try {
            const response = await axios.post('http://10.0.2.2:4167/user/signup/otp', {
                name,
                email,
                password,
            });
            
            if(response.data.success){
                navigation.navigate("OtpScreen", {
                    email,
                    counter: 1
                });
            }
            else{
                Alert.alert("Something Went Wrong!");
                console.log(response.data.message);
            }

        } catch (err) {
            Alert.alert('Sign Up Failed!!',
                err.response?.data?.message || 'Error'
            );
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.Container}>
                <Text>Add Random app image or logo</Text>
                <Text style={styles.HeaderTxt}>Create an account</Text>
                <FormInput
                    iconType='Feather'
                    iconName='user'
                    iconSize={17}
                    placeholderText={'Full Name'}
                    labelValue={name}
                    onChangeText={(name) => setName(name)}
                    autoCorrect={false}
                />
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
                <FormButton
                    buttonTitle={'Sign Up'}
                    onPress={signUpHandler}
                />
                <View style={styles.SignInContainer}>
                    <Text style={styles.SignInTxt}>
                        Already have an Account?
                    </Text>
                    <TouchableOpacity>
                        <Text style={[styles.SignInTxt, { color: '#2e64e5' }]} onPress={() => { navigation.navigate("LoginScreen") }}>Sign In!</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.TCcontainer}>
                    <Text style={styles.TCtxt}>
                        By registering, you confirm that you have accepted our
                    </Text>
                    <TouchableOpacity>
                        <Text style={[styles.TCtxt, { color: '#2e64e5' }]} onPress={() => { navigation.navigate("LoginScreen") }}>Terms of service</Text>
                    </TouchableOpacity>
                    <Text style={styles.TCtxt}> and </Text>
                    <TouchableOpacity>
                        <Text style={[styles.TCtxt, { color: '#2e64e5' }]} onPress={() => { navigation.navigate("LoginScreen") }}>Privacy policy</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default SignupScreen

const styles = StyleSheet.create({
    Container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    HeaderTxt: {
        fontSize: 25,
        fontWeight: 'bold',
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
    },
    TCcontainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginVertical: 35,
        flexWrap: "wrap",
    },
    TCtxt: {
        fontSize: 13,
        fontWeight: '400',
        color: 'grey',
    },
})
