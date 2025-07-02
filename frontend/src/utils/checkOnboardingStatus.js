import AsyncStorage from '@react-native-async-storage/async-storage';

const checkOnboardingStatus = async () => {
  try {
    const value = await AsyncStorage.getItem('@onboarding_completed');
    if (value === null) {
      // First time launch
      await AsyncStorage.setItem('@onboarding_completed', 'true');
      return true; // Onboarding needed
    } else {
      return false; // Already completed
    }
  } catch (error) {
    console.error('Error checking onboarding:', error);
    return false; // Fallback to main app
  }
};

export default checkOnboardingStatus;