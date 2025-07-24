import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import BackButton from '../../components/BackButton';

const PersonalDetailsScreen = () => {
    const [name, setName] = useState('Dikshant');
    const [email, setEmail] = useState('dikshant@example.com');

    const handleSave = () => {
        Alert.alert('Saved', 'Your personal details have been updated.');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <BackButton />
                <Text style={styles.headerText}>
                    Personal Details
                </Text>
            </View>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Full Name"
            />
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                keyboardType="email-address"
            />
            <Button title="Save" onPress={handleSave} />
        </View>
    );
};

export default PersonalDetailsScreen;

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
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 6,
        marginBottom: 12,
    },
});
