import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton';
import LoginScreen from './LoginScreen';

const SignupScreen = ({ navigation }) => {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    return (
        <View style={styles.Container}>
            <Text>Add Random app image or logo</Text>
            <Text style={styles.HeaderTxt}>Create an account</Text>
            <FormInput
                iconType='Feather'
                iconName='user'
                iconSize={17}
                placeholderText={'University Mail ID'}
                labelValue={email}
                onChangeText={(userEmail) => setEmail(userEmail)}
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
                onChangeText={(userPassword) => setPassword(userPassword)}
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
                onChangeText={(userConfirmPassword) => setConfirmPassword(userConfirmPassword)}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={true}
            />
            <FormButton
                buttonTitle={'Sign Up'}
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
    TCcontainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginVertical: 35,
        flexWrap: "wrap",
    },
    TCtxt: {
        fontSize: 13,
        fontWeight: '400',
        fontFamily: 'Lato-Regular',
        color: 'grey',
    },
})