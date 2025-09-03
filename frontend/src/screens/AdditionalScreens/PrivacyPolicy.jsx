
import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import BackButton from '../../components/BackButton';

const PrivacyPolicy = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerText}>Privacy Policy</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          Welcome to <Text style={styles.bold}>Random</Text>! Your privacy is
          important to us. This Privacy Policy explains how we collect, use, and
          protect your personal information when you use our app.
        </Text>

        <Text style={styles.sectionTitle}>2. Information We Collect</Text>
        <Text style={styles.paragraph}>
          We collect information you provide directly to us, such as:
        </Text>
        <Text style={styles.listItem}>• Name, email, and profile photo</Text>
        <Text style={styles.listItem}>• Location (to connect you with friends nearby)</Text>
        <Text style={styles.listItem}>• Messages and posts you share</Text>

        <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use your information to:
        </Text>
        <Text style={styles.listItem}>• Help you find and connect with friends in your location</Text>
        <Text style={styles.listItem}>• Show relevant content and suggestions</Text>
        <Text style={styles.listItem}>• Keep our community safe</Text>

        <Text style={styles.sectionTitle}>4. Sharing Your Information</Text>
        <Text style={styles.paragraph}>
          We do not sell your personal data. We may share it with:
        </Text>
        <Text style={styles.listItem}>• Other users (only what you choose to share)</Text>
        <Text style={styles.listItem}>• Service providers that help us run the app</Text>
        <Text style={styles.listItem}>• Authorities if required by law</Text>

        <Text style={styles.sectionTitle}>5. Location Data</Text>
        <Text style={styles.paragraph}>
          Since Random is location-based, we collect your location to show nearby
          users. You can disable location access anytime in your device settings,
          but some features may not work.
        </Text>

        <Text style={styles.sectionTitle}>6. Security</Text>
        <Text style={styles.paragraph}>
          We use encryption and secure servers to protect your data, but no
          method of transmission over the internet is 100% secure.
        </Text>

        <Text style={styles.sectionTitle}>7. Your Rights</Text>
        <Text style={styles.paragraph}>
          You can request to view, edit, or delete your personal data anytime by
          contacting our support team.
        </Text>

        <Text style={styles.sectionTitle}>8. Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. We will notify you
          of significant changes through the app.
        </Text>

        <Text style={styles.sectionTitle}>9. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this Privacy Policy, contact us at:
          <Text style={styles.bold}> support@randomapp.com</Text>
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 15,
    marginVertical: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#bbb',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    color: '#000',
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    color: '#444',
  },
  listItem: {
    fontSize: 15,
    marginTop: 4,
    color: '#444',
  },
  bold: {
    fontWeight: 'bold',
  },
});

