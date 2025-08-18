// screens/AdditionalScreens/TermsAndConditions.jsx
import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import BackButton from '../../components/BackButton';

const TermsScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerText}>Terms & Conditions</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.paragraph}>
          Welcome to <Text style={styles.bold}>Random</Text>, a location-based
          social media platform where you can connect with people nearby, share
          moments, and make new friends. By accessing or using our app, you
          agree to these Terms & Conditions.
        </Text>

        <Text style={styles.sectionTitle}>2. Eligibility</Text>
        <Text style={styles.paragraph}>
          You must be at least 13 years old to use Random. If you are under 18,
          you must have parental consent.
        </Text>

        <Text style={styles.sectionTitle}>3. Account Responsibilities</Text>
        <Text style={styles.paragraph}>
          You are responsible for:
        </Text>
        <Text style={styles.listItem}>• Keeping your account credentials secure</Text>
        <Text style={styles.listItem}>• Not sharing your account with others</Text>
        <Text style={styles.listItem}>• Any activity that happens under your account</Text>

        <Text style={styles.sectionTitle}>4. Location Access</Text>
        <Text style={styles.paragraph}>
          Random requires access to your location to connect you with nearby
          users. You can disable location in your settings, but some features
          may not work properly.
        </Text>

        <Text style={styles.sectionTitle}>5. User Conduct</Text>
        <Text style={styles.paragraph}>
          By using Random, you agree NOT to:
        </Text>
        <Text style={styles.listItem}>• Post illegal, harmful, or abusive content</Text>
        <Text style={styles.listItem}>• Harass, threaten, or impersonate others</Text>
        <Text style={styles.listItem}>• Use the app for spam, scams, or fraud</Text>

        <Text style={styles.sectionTitle}>6. Content Ownership</Text>
        <Text style={styles.paragraph}>
          You retain ownership of the content you post, but grant Random a
          non-exclusive, worldwide, royalty-free license to display and share
          your content within the app.
        </Text>

        <Text style={styles.sectionTitle}>7. Termination</Text>
        <Text style={styles.paragraph}>
          We may suspend or terminate your account if you violate these Terms,
          without prior notice.
        </Text>

        <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          Random is provided "as is." We are not responsible for any loss,
          damage, or harm caused by interactions with other users or technical
          issues.
        </Text>

        <Text style={styles.sectionTitle}>9. Changes to Terms</Text>
        <Text style={styles.paragraph}>
          We may update these Terms & Conditions from time to time. Continued
          use of the app after changes means you accept the updated terms.
        </Text>

        <Text style={styles.sectionTitle}>10. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have questions about these Terms & Conditions, contact us at:
          <Text style={styles.bold}> support@randomapp.com</Text>
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default TermsScreen;

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
