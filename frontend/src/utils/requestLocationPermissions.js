import { PermissionsAndroid, Platform } from 'react-native';

const requestLocationPermissions = async () => {
    // Step 1: Ask for foreground location
    try{
        const fineLocationGranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location Permission',
                message: 'We need your location for background tracking.',
                buttonPositive: 'OK',
            }
        );

        if (fineLocationGranted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('✅ Foreground location granted');

            // Step 2: Ask for background location (Android 10+ only)
            if (Platform.Version >= 29) {
                const bgLocationGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
                    {
                        title: 'Background Location Permission',
                        message: 'We need background location so tracking works even when app is closed.',
                        buttonPositive: 'OK',
                    }
                );

                if (bgLocationGranted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('✅ Background location granted');
                    return true;
                } else {
                    console.log('❌ Background location denied');
                    return false;
                }
            }

            return true;
        } else {
            console.log('❌ Foreground location denied');
            return false;
        }
    } catch(err){
        console.log("Request Location Permissions Error: ", err)
    }
    
}

export default requestLocationPermissions;