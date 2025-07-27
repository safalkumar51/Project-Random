package com.random.locationtracker;

import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import javax.annotation.Nullable;

/**
 * ✅ LocationModule
 * - Starts/stops the LocationService
 * - Provides helper method to emit location updates to React Native
 */
public class LocationModule extends ReactContextBaseJavaModule {

    private static final String TAG = "LocationModule";
    private static ReactApplicationContext reactContextStatic;

    public LocationModule(ReactApplicationContext reactContext) {
        super(reactContext);
        reactContextStatic = reactContext; // static so service can use it too
    }

    @Override
    public String getName() {
        return "LocationModule";
    }

    /** ✅ Start Foreground Service */
    @ReactMethod
    public void startService(String authToken) {
        try {
            Intent serviceIntent = new Intent(getReactApplicationContext(), LocationService.class);
            serviceIntent.putExtra("AUTH_TOKEN", authToken); // ✅ pass token
            getReactApplicationContext().startForegroundService(serviceIntent);
            Log.d(TAG, "LocationService started via React Native");
        } catch (Exception e) {
            Log.e(TAG, "Failed to start service: " + e.getMessage());
        }
    }

    /** ✅ Stop Foreground Service */
    @ReactMethod
    public void stopService() {
        try {
            Intent serviceIntent = new Intent(getReactApplicationContext(), LocationService.class);
            getReactApplicationContext().stopService(serviceIntent);
            Log.d(TAG, "LocationService stopped via React Native");

            // ✅ Clear stored token when user logs out
            getReactApplicationContext()
                .getSharedPreferences("LocationServicePrefs", android.content.Context.MODE_PRIVATE)
                .edit()
                .remove("AUTH_TOKEN")
                .remove("BASE_URL")
                .apply();
            Log.d(TAG, "🗑 Token cleared after logout");
        } catch (Exception e) {
            Log.e(TAG, "Failed to stop service: " + e.getMessage());
        }
    }


    /** ✅ Helper for service to emit events to JS */
    public static void sendLocationToJS(double lat, double lng) {
        if (reactContextStatic != null) {
            try {
                reactContextStatic
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onLocationUpdate", lat + "," + lng); // 🚀 emits a string like "26.50,80.28"
            } catch (Exception e) {
                Log.e(TAG, "Failed to emit location: " + e.getMessage());
            }
        }
    }
}
