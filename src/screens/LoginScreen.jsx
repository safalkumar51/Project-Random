import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import SignupScreen from './SignupScreen'
import ForgotPasswordScreen from './ForgotPasswordScreen'

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  return (
    <View style={styles.Container}>
      <Text>Add Random app image or logo</Text>
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
      <FormButton
        buttonTitle='Sign In'
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