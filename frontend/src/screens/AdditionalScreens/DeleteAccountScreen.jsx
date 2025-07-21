import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import BackButton from '../../components/BackButton';

const DeleteAccountScreen = () => {
    const handleDelete = () => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete your account?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Account Deleted') },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <BackButton />
                <Text style={styles.headerText}>
                    Delete Account
                </Text>
            </View>
            <Text style={styles.warning}>
                This action is irreversible. Your account and data will be permanently deleted.
            </Text>
            <Button title="Delete Account" color="red" onPress={handleDelete} />
        </View>
    );
};

export default DeleteAccountScreen;

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
    warning: {
        fontSize: 16,
        color: 'black',
        marginBottom: 20,
    },
});
