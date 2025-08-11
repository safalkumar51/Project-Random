// LocationModule.swift

import Foundation
import CoreLocation
import React

@objc(LocationModule)
class LocationModule: RCTEventEmitter {

  private let locationService = LocationService.shared // Singleton instance
  private var hasListeners = false

  // ✅ Expose this module to React Native
  override static func moduleName() -> String! {
    return "LocationModule"
  }
  
  // This is required for modules that inherit from RCTEventEmitter
  override static func requiresMainQueueSetup() -> Bool {
    return true
  }

  // ✅ Methods to call from React Native
  @objc(startService:)
  func startService(authToken: String) {
    print("📍 [LocationModule] startService called.")
    locationService.startTracking(authToken: authToken)
  }

  @objc(stopService)
  func stopService() {
    print("🛑 [LocationModule] stopService called.")
    locationService.stopTracking()
  }

  // ✅ Define the event name that will be sent to JavaScript
  override func supportedEvents() -> [String]! {
    return ["onLocationUpdate"]
  }

  // ✅ When a JS listener is added, set the callback on our service
  override func startObserving() {
    hasListeners = true
    locationService.onLocationUpdate = { [weak self] lat, lon in
      guard let self = self, self.hasListeners else { return }
      
      // 🚀 Send location as a string "lat,lng" for consistency with Android
      let locationString = "\(lat),\(lon)"
      self.sendEvent(withName: "onLocationUpdate", body: locationString)
    }
  }

  // ✅ When the last JS listener is removed, clear the callback
  override func stopObserving() {
    hasListeners = false
    locationService.onLocationUpdate = nil
  }
}