import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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
      <Text style={styles.header}>Settings</Text>

      <Option label="About" screen="About" />
      <Option label="Help" screen="Help & Support" />
      <Option label="Personal Details" screen="Personal Details" />
      <Option label="Delete Account" screen="Delete Account" />
      <Option label="Terms & Conditions" screen="Terms" />
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  option: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
});
