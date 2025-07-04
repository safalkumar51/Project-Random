import AsyncStorage from '@react-native-async-storage/async-storage';

const setToken = async (authToken) => {
    try {
        await AsyncStorage.setItem('authToken', authToken);
        console.log('Token saved');
    } catch (error) {
        console.error('Error saving token:', error);
    }
};

export default setToken;

/*  
getAuthToken :
    async () => {
    const authToken = await AsyncStorage.getItem('authToken');

removeAuthToken : 
    async () => {
    await AsyncStorage.removeItem('token');
*/