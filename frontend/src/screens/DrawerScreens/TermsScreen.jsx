import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const TermsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Terms & Conditions</Text>

      <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
      <Text style={styles.text}>
        By using this app (“Random”), you agree to abide by the terms and conditions outlined below. If you do not agree, please refrain from using the app.

      </Text>

      <Text style={styles.sectionTitle}>2. User Responsibility</Text>
      <Text style={styles.text}>
        You are solely responsible for the messages you send and receive. Any misuse, abuse, or illegal activity may result in suspension or termination of your access.
      </Text>

      <Text style={styles.sectionTitle}>3. Privacy</Text>
      <Text style={styles.text}>
        We respect your privacy. Your messages are not stored on our servers longer than necessary and are never sold or shared with third parties.
      </Text>

      <Text style={styles.sectionTitle}>4. Account Deletion</Text>
      <Text style={styles.text}>
        You may delete your account at any time from the Settings menu. This will remove your personal details and message history.
      </Text>

      <Text style={styles.sectionTitle}>5. Limitations</Text>
      <Text style={styles.text}>
        We are not responsible for loss of data, interrupted service, or third-party behavior on this platform.
      </Text>

      <Text style={styles.sectionTitle}>6. Modifications</Text>
      <Text style={styles.text}>
        These terms may be updated at any time. Continued use of the app implies acceptance of any changes.
      </Text>

      <Text style={styles.sectionTitle}>7. Contact</Text>
      <Text style={styles.text}>
        If you have any questions, contact us via the Help section in the app.
      </Text>

      <Text style={styles.footer}>Last updated: July 2025</Text>
    </ScrollView>
  );
};

export default TermsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#334',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 6,
    color: '#334',
  },
  text: {
    fontSize: 15,
    color: 'black',
    lineHeight: 22,
  },
  footer: {
    marginTop: 30,
    fontSize: 12,
    color: '#aaa',
    textAlign: 'center',
  },
});
