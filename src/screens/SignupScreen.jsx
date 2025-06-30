import { StyleSheet, Text, TouchableOpacity, View, Alert} from 'react-native'
import React, { useState } from 'react'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton';
import LoginScreen from './LoginScreen';
import axios from 'axios';

const SignupScreen = ({ navigation }) => {
    const [userName, setUserName] = useState();
    const [userEmail, setUserEmail] = useState();
    const [userPassword, setUserPassword] = useState();
    const [userConfirmPassword, setUserConfirmPassword] = useState();

    const signUpHandler = async () => {
        if(!userEmail.endsWith("@hbtu.ac.in")){
            alert("Only college email allowed.");
            return;
        }
        if(userPassword !== userConfirmPassword){
            Alert.alert(
                "Sign Up Failed!!",
                "Enter Password Carefully!"
            );
            return;
        }
        try {
            const res = await axios.post('http://localhost:3000/user/signup', {
                userName,
                userEmail,
                userPassword,
                userConfirmPassword
            });
            // Verification needed and add verification
            Alert.alert('Signup Successful!!',
                'Now you can Sign In!'
            );
        } catch (err) {
            Alert.alert('Signup Failed!!',
                err.response?.data?.message || 'Error'
            );
        }
    };

    return (
        <View style={styles.Container}>
            <Text>Add Random app image or logo</Text>
            <Text style={styles.HeaderTxt}>Create an account</Text>
            <FormInput
                iconType='Feather'
                iconName='user'
                iconSize={17}
                placeholderText={'Full Name'}
                labelValue={userName}
                onChangeText={(userName) => setUserName(userName)}
                autoCorrect={false}
            />
            <FormInput
                iconType='Feather'
                iconName='user'
                iconSize={17}
                placeholderText={'University Mail ID'}
                labelValue={userEmail}
                onChangeText={(userEmail) => setUserEmail(userEmail)}
                keyboardType='email-address'
                autoCapitalize="none"
                autoCorrect={false}
            />
            <FormInput
                iconType='EvilIcons'
                iconName='lock'
                iconSize={25}
                placeholderText={'Password'}
                labelValue={userPassword}
                onChangeText={(userPassword) => setUserPassword(userPassword)}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={true}
            />
            <FormInput
                iconType='EvilIcons'
                iconName='lock'
                iconSize={25}
                placeholderText={'Confirm Password'}
                labelValue={userConfirmPassword}
                onChangeText={(userConfirmPassword) => setUserConfirmPassword(userConfirmPassword)}
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
                    <Text style={[styles.SignInTxt ,{color:'#2e64e5'}]} onPress={() => { navigation.navigate("LoginScreen") }}>Sign In!</Text>
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
