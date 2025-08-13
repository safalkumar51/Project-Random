import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../../components/BackButton';
import TeamRandom from '../AdditionalScreens/TeamRandom';

const SettingsScreen = () => {
    const navigation = useNavigation();

    const Option = ({ label, screen }) => (
        <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate(screen)}
        >
            <Text style={styles.optionText}>{label}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <BackButton />
                <Text style={styles.headerText}>
                    Settings
                </Text>
            </View>
            <Option label="About" screen="About" />
            <Option label="Delete Account" screen="Delete Account" />
            <Option label="Help" screen="Help & Support" />
            <Option label="Personal Details" screen="Personal Details" />
            <Option label="Terms & Conditions" screen="Terms" />
             <Option label="Team Random" screen="TeamRandom" />
            
        </View>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginHorizontal: -15,
        marginVertical: 15,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#bbb',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    option: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    optionText: {
        fontSize: 17,
        fontWeight: 400,
        color: '#333',
    },
});
