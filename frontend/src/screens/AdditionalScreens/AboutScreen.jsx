import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

const AboutScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>About Random</Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Random</Text> is a lightweight and secure messaging platform designed to connect people in the simplest way possible. Whether you're collaborating with teammates, catching up with friends, or just sharing ideas — Random makes communication fast, clean, and easy.
      </Text>

      <Text style={styles.subtitle}>✨ Key Features</Text>
      <Text style={styles.bullet}>• Real-time Chat with smooth UI</Text>
      <Text style={styles.bullet}>• Personal and Group Messaging</Text>
      <Text style={styles.bullet}>• Privacy-focused architecture</Text>
      <Text style={styles.bullet}>• Lightweight & battery-efficient</Text>
      <Text style={styles.bullet}>• Easy-to-use navigation and settings</Text>

      <Text style={styles.subtitle}>🛡️ Privacy & Safety</Text>
      <Text style={styles.paragraph}>
        Your data is private, and your messages stay between you and your contacts. We don’t collect or sell any of your personal information. For more details, please read our Terms & Conditions.
      </Text>

      <Text style={styles.subtitle}>📬 Need Help?</Text>
      <Text style={styles.paragraph}>
        Visit the <Text style={styles.bold}>Help</Text> section in the settings or reach out to our support team anytime.
      </Text>

      <Text style={styles.subtitle}>📱 Version -  v2.0.0</Text>
      <Text style={styles.paragraph}>v2.0.0</Text>
    </ScrollView>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
    color: 'black',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: 'black',
  },
  bold: {
    fontWeight: 'bold',
  },
  bullet: {
    fontSize: 16,
    marginLeft: 10,
    lineHeight: 24,
    color: 'black',
  },
});
