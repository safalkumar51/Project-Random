import React from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';

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
      <Text style={styles.header}>Delete Account</Text>
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  warning: {
    fontSize: 16,
    color: 'black',
    marginBottom: 20,
  },
});
