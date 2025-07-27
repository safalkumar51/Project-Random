package com.random.locationtracker;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.Call;                         // for the OkHttp Call object
import okhttp3.Callback;                     // for async callback handler

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;
import android.util.Log;

import android.Manifest;
import android.content.pm.PackageManager;
import androidx.core.app.ActivityCompat;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;

import java.util.concurrent.TimeUnit;        // for connectTimeout, readTimeout, writeTimeout
import java.io.IOException;                  // for IOException in onFailure/onResponse

import android.os.Looper;

/**
 * ✅ LocationService
 *
 * - Runs as a **Foreground Service** (persistent notification)
 * - Uses Google's **FusedLocationProviderClient** (battery‑friendly location tracking)
 * - Calls `checkAndPromptGPS()` to launch a transparent activity that shows the
 *   "Turn on location?" dialog if GPS is disabled
 */
public class LocationService extends Service {

    // ---- CONSTANTS ----
    private static final String TAG = "LocationService";   // For logcat debugging
    private static final String CHANNEL_ID = "location_channel"; // Notification channel ID

    // ---- GOOGLE LOCATION VARIABLES ----
    private FusedLocationProviderClient fusedClient; // Main location provider
    private LocationCallback locationCallback;       // Callback for updates

    OkHttpClient client = new OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)  // ⏳ time to connect to server
        .writeTimeout(30, TimeUnit.SECONDS)    // ⏳ time to send request
        .readTimeout(30, TimeUnit.SECONDS)     // ⏳ time to read response
        .retryOnConnectionFailure(true)        // ✅ retry automatically
        .build();

    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    private String authToken = null;
    private static final String PREFS_NAME = "LocationServicePrefs";
    private static final String KEY_AUTH_TOKEN = "AUTH_TOKEN";


    // ---- SERVICE LIFECYCLE ----
    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        // We don’t bind this service to an Activity/JS module → return null
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Log.d(TAG, "LocationService created");

        // ✅ 1️⃣ Create./gralde Notification Channel
        createNotificationChannel();

        // ✅ 2️⃣ Start Foreground Service
        Notification notification = buildNotification();
        startForeground(1, notification);

        // ✅ 3️⃣ Prompt user to enable GPS if OFF
        checkAndPromptGPS();

        // ✅ 4️⃣ Initialize fused location provider
        fusedClient = LocationServices.getFusedLocationProviderClient(this);

        // ✅ 5️⃣ Define what happens on location updates
        locationCallback = new LocationCallback() {
            @Override
            public void onLocationResult(LocationResult locationResult) {
                if (locationResult == null) return;

                for (android.location.Location location : locationResult.getLocations()) {
                    double lat = location.getLatitude();
                    double lng = location.getLongitude();
                    Log.d(TAG, "Lat: " + lat + " | Lng: " + lng);

                    // ✅ Send to backend even if app is dead
                    sendLocationToBackend(lat, lng);

                    // 🚀 Send update to React Native if running
                    // LocationModule.sendLocationToJS(lat, lng);
                }
            }
        };

        // ✅ 6️⃣ Start requesting location updates
        startLocationUpdates();
    }


    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && intent.hasExtra("AUTH_TOKEN")) {
            // ✅ Token provided by RN → save it
            authToken = intent.getStringExtra("AUTH_TOKEN");
            saveToken(authToken);

            Log.d(TAG, "✅ Received token from React Native: " + authToken);
        } else {
            // 🔄 No token in intent → try to reload from SharedPreferences
            authToken = getSavedToken();
            if (authToken != null) {
                Log.d(TAG, "✅ Loaded token from SharedPreferences: " + authToken);
            } else {
                Log.e(TAG, "❌ No token found! Cannot authenticate location calls.");
            }
        }

        // ✅ 1️⃣ Check if location permission is still granted
        boolean hasPermission = ActivityCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
                || ActivityCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED;

        if (!hasPermission) {
            Log.w(TAG, "🚫 No location permission → Service will NOT restart if stopped");
            // ⛔ If user revoked permission, stop now & don’t restart
            stopForeground(true);
            stopSelf();
            return START_NOT_STICKY;
        }

        // ✅ Start location updates
        startLocationUpdates();

        Log.d(TAG, "✅ Location permission present → Service will auto-restart if killed");
        // ✅ If system kills it (e.g., low memory), Android restarts the service
        return START_STICKY;

    }


    @Override
    public void onDestroy() {
        super.onDestroy();

        // ✅ Stop receiving updates to save resources
        if (fusedClient != null && locationCallback != null) {
            fusedClient.removeLocationUpdates(locationCallback);
        }

        sendLocationToBackend(85.0, -179.0);

        // ✅ Remove notification
        stopForeground(true);

        Log.d(TAG, "LocationService destroyed");
    }

    private void saveToken(String token) {
        getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
            .edit()
            .putString(KEY_AUTH_TOKEN, token)
            .apply();
        Log.d(TAG, "✅ Token saved to SharedPreferences");
    }

    private String getSavedToken() {
        return getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
            .getString(KEY_AUTH_TOKEN, null);
    }

    private void clearToken() {
        getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
            .edit()
            .remove(KEY_AUTH_TOKEN)
            .apply();
        Log.d(TAG, "🗑 Token cleared from SharedPreferences");
    }

    private void startLocationUpdates() {
        try {
            // ✅ Create location request (every 5 sec, high accuracy)
            LocationRequest locationRequest = new LocationRequest.Builder(
                    LocationRequest.PRIORITY_HIGH_ACCURACY,
                    5000 // 5 seconds
            ).setMinUpdateDistanceMeters(0)   // trigger for every movement
            .build();

            // ✅ Ask fused client for location updates
            fusedClient.requestLocationUpdates(
                locationRequest,
                locationCallback,
                Looper.getMainLooper()
            );

            Log.d(TAG, "✅ Fused location updates started");
        } catch (SecurityException e) {
            Log.e(TAG, "❌ Permission not granted for location");
            stopForeground(true);
            stopSelf();  // stops the service gracefully
        }
    }

    // ---- GPS CHECK ----
    /**
     * ✅ Launches a transparent activity to show system GPS dialog if location is off.
     * This keeps the service clean & modular.
     */
    private void checkAndPromptGPS() {
        try {
            Intent enableIntent = new Intent(getApplicationContext(), EnableLocationActivity.class);
            enableIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK); // Required since we are in a Service, since service is not the part of a UI stack
            startActivity(enableIntent);
            Log.d(TAG, "Checking GPS settings (will show dialog if OFF)");
        } catch (Exception e) {
            Log.e(TAG, "Failed to launch GPS enable activity: " + e.getMessage());
        }
    }

    // ✅ Modified sendLocationToBackend using enqueue()
    private void sendLocationToBackend(double lat, double lng) {
        // 👇 Replace with your API endpoint
        String url = "http://10.72.0.124:4167/location";

        // ✅ Build JSON body like { "lat": 26.5, "lon": 80.28 }
        String json = "{\"lat\":" + lat + ",\"lon\":" + lng + "}";

        RequestBody body = RequestBody.create(json, JSON);
        Request.Builder builder = new Request.Builder()
                .url(url)
                .post(body)
                .addHeader("Content-Type", "application/json");

        // ✅ Add auth token if available
        if (authToken != null) {
            builder.addHeader("Authorization", "Bearer " + authToken);
        }

        Request request = builder.build();

        // ✅ Enqueue async request (no need for new Thread)
        client.newCall(request).enqueue(new Callback() {
            @Override
            public void onFailure(Call call, IOException e) {
                Log.e(TAG, "❌ Failed to send location", e);  // Full stack trace
            }

            @Override
            public void onResponse(Call call, Response response) throws IOException {
                try {
                    if (!response.isSuccessful()) {
                        Log.e(TAG, "❌ Backend responded with error: " + response);
                    } else {
                        Log.d(TAG, "✅ Location sent to backend");
                    }
                } finally {
                    response.close(); // ✅ Close response to avoid leaks
                }
            }
        });
    }


    // ---- NOTIFICATION HANDLING ----
    /**
     * ✅ Creates the Notification Channel (Android 8+)
     * Foreground services MUST have a channel or they will crash.
     */
    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "Location Tracking",
                    NotificationManager.IMPORTANCE_LOW // Low → No sound/vibration
            );
            channel.setDescription("Used for background location tracking");

            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    /**
     * ✅ Builds the persistent notification that keeps this service alive.
     */
    private Notification buildNotification() {
        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentTitle("Using location")       // Title
                .setContentText("Your location is being used to explore nearby people.") // Subtext
                .setSmallIcon(android.R.drawable.ic_menu_mylocation)      // Default location icon
                .setOngoing(true)                                         // Can't be swiped away
                .build();
    }
    
}
