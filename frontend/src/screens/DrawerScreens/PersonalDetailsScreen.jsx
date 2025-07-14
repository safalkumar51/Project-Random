import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';

const PersonalDetailsScreen = () => {
  const [name, setName] = useState('Dikshant');
  const [email, setEmail] = useState('dikshant@example.com');

  const handleSave = () => {
    Alert.alert('Saved', 'Your personal details have been updated.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Edit Personal Details</Text>
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
});
