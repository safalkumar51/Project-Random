import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const HelpScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Help & Support</Text>
      <Text style={styles.text}>
        If you're experiencing any issues or have questions, please reach out to our support team at support@example.com.
        {"\n\n"}FAQs will appear here...
      </Text>
    </ScrollView>
  );
};

export default HelpScreen;

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
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});
