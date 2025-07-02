import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

import { SafeAreaView } from 'react-native-safe-area-context';

import FormInput from '../../components/FormInput';
import FormButton from '../../components/FormButton';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState();
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
                    onChangeText={(userEmail) => setEmail(userEmail)}
                    keyboardType='email-address'
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <FormButton
                    buttonTitle='Verify'
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