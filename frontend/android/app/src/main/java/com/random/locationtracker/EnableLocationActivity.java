package com.random.locationtracker;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.Nullable;

import com.google.android.gms.common.api.ResolvableApiException;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.location.LocationSettingsResponse;
import com.google.android.gms.location.SettingsClient;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;

/**
 * ✅ A transparent activity that triggers the system "Enable GPS?" dialog if location is off.
 * Called from LocationService when GPS is disabled.
 */
public class EnableLocationActivity extends Activity {
    private static final int REQUEST_CHECK_SETTINGS = 1001;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Make the activity invisible (transparent)
        requestWindowFeature(1); // 1 >> no title bar
        getWindow().setBackgroundDrawableResource(android.R.color.transparent);

        // ✅ Build a location request (dummy for checking GPS)
        LocationRequest locationRequest = new LocationRequest.Builder(
            LocationRequest.PRIORITY_HIGH_ACCURACY, 5000
        ).build();

        // ✅ Build settings request >> Prepare a request for GPS check
        LocationSettingsRequest.Builder builder = new LocationSettingsRequest.Builder()
                .addLocationRequest(locationRequest);

        SettingsClient client = LocationServices.getSettingsClient(this);

        // ✅ Check device location settings
        Task<LocationSettingsResponse> task = client.checkLocationSettings(builder.build());

        //When Android is done checking, run this code next
        task.addOnCompleteListener(new OnCompleteListener<LocationSettingsResponse>() {
            @Override
            public void onComplete(Task<LocationSettingsResponse> task) {
                try {
                    task.getResult(ResolvableApiException.class);
                    // ✅ GPS is already ON, just close
                    finish();
                } catch (Exception e) {
                    // ❌ GPS is OFF → show dialog
                    if (e instanceof ResolvableApiException) {
                        try {
                            ((ResolvableApiException) e)
                                    .startResolutionForResult(EnableLocationActivity.this, REQUEST_CHECK_SETTINGS);
                        } catch (Exception sendEx) {
                            Log.e("EnableLocation", "Failed to show GPS dialog");
                            finish();
                        }
                    } else {
                        finish();
                    }
                }
            }
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        // ✅ Close activity regardless of user choice (yes/no)
        finish();
    }
}
