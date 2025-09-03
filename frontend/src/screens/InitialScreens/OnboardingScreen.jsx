import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'

import Onboarding from 'react-native-onboarding-swiper';

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Skip = ({...props}) => (
    <TouchableOpacity style={styles.container} {...props}>
        <Text style={styles.text}>Skip</Text>
    </TouchableOpacity>
);
const Next = ({...props}) => (
    <TouchableOpacity style={styles.container} {...props}>
        <Text style={styles.text}>Next</Text>
    </TouchableOpacity>
);
const Done = ({...props}) => (
    <TouchableOpacity style={styles.container} {...props}>
        <Text style={styles.text}>Done</Text>
    </TouchableOpacity>
);


const OnboardingScreen = ({ navigation }) => {
    return (
        <Onboarding
            SkipButtonComponent={Skip}
            NextButtonComponent={Next}
            DoneButtonComponent={Done}

            onSkip={() => {navigation.replace("LoginScreen")}}
            onDone={() => {navigation.replace("LoginScreen")}}
            
            pages={[
                {
                    backgroundColor: '#fff',
                    image: (
                        <Image
                            source={require('../../assets/Onboarding-img/Onboarding-img1.png')}
                            style={{
                                width: width * 0.8,       // 80% of screen width
                                height: height * 0.4,     // 40% of screen height
                                resizeMode: 'contain'
                            }}
                        />
                    ),
                    title: 'RadNow',
                    titleStyles: {
                        fontSize: width * 0.08,       // Responsive font size
                        marginBottom: height * 0.02
                    },
                    subtitle: 'Welcome to a new way of exploring people!!',
                    subTitleStyles: {
                        fontSize: width * 0.05,
                        paddingHorizontal: width * 0.1
                    }
                },
                {
                    backgroundColor: '#fff',
                    image: (
                        <Image
                            source={require('../../assets/Onboarding-img/Onboarding-img2.png')}
                            style={{
                                width: width * 0.9,       // 80% of screen width
                                height: height * 0.4,     // 40% of screen height
                                resizeMode: 'contain'
                            }}
                        />
                    ),
                    title: 'RadNow',
                    titleStyles: {
                        fontSize: width * 0.08,       // Responsive font size
                        marginBottom: height * 0.02
                    },
                    subtitle: 'Explore people around you in real-time',
                    subTitleStyles: {
                        fontSize: width * 0.05,
                        paddingHorizontal: width * 0.1
                    }
                },
                {
                    backgroundColor: '#fff',
                    image: (
                        <Image
                            source={require('../../assets/Onboarding-img/Onboarding-img3.png')}
                            style={{
                                width: width * 0.8,       // 80% of screen width
                                height: height * 0.4,     // 40% of screen height
                                resizeMode: 'contain'
                            }}
                        />
                    ),
                    title: 'RadNow',
                    titleStyles: {
                        fontSize: width * 0.08,       // Responsive font size
                        marginBottom: height * 0.02
                    },
                    subtitle: 'A Social Media App',
                    subTitleStyles: {
                        fontSize: width * 0.05,
                        paddingHorizontal: width * 0.1
                    }
                },
            ]}
        />
    )
}

export default OnboardingScreen

const styles = StyleSheet.create({
    container:{
        margin:'8',
    },
    text: {
        fontWeight:'690',
        fontFamily:'Gabriel',
        fontSize:20
    }
})