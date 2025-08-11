// LocationService.swift

import Foundation
import CoreLocation

class LocationService: NSObject, CLLocationManagerDelegate {
    
  static let shared = LocationService() // ✅ Singleton

  private let manager = CLLocationManager()
  private var authToken: String?
  
  // ✅ Callback to notify React Native module
  var onLocationUpdate: ((Double, Double) -> Void)?
  
  // ✅ Keys for persistence
  private let KEY_AUTH_TOKEN = "AUTH_TOKEN"

  private override init() {
    super.init()
    manager.delegate = self
    manager.desiredAccuracy = kCLLocationAccuracyBest      // High accuracy
    manager.distanceFilter = 20                           // 20 meters minimum change (Saves battery!)
    manager.allowsBackgroundLocationUpdates = true      // Required for background tracking
    manager.pausesLocationUpdatesAutomatically = false  // Required for continuous updates
  }

  // MARK: - Public Methods
  
  func startTracking(authToken: String) {
    print("📍 [LocationService] Starting tracking...")
    self.authToken = authToken
    self.saveToken(token: authToken) // ✅ Persist the token
    
    // Ask for permission if not yet granted
    if manager.authorizationStatus == .notDetermined {
        manager.requestAlwaysAuthorization()
    }
    
    manager.startUpdatingLocation()
  }
  
  func stopTracking() {
    print("🛑 [LocationService] Stopping tracking...")
    manager.stopUpdatingLocation()
    self.authToken = nil
    self.clearToken() // ✅ Clear the persisted token
  }

  // MARK: - CLLocationManagerDelegate
  
  func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
    switch manager.authorizationStatus {
    case .authorizedAlways:
      print("✅ [LocationService] Location permission 'Always' granted.")
    case .denied, .restricted:
      print("❌ [LocationService] Location permission denied. Stopping service.")
      stopTracking()
    default:
      print("ℹ️ [LocationService] Location permission is not 'Always'.")
    }
  }
  
  func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
    guard let location = locations.last else { return }
    let lat = location.coordinate.latitude
    let lon = location.coordinate.longitude
    
    print("📍 [LocationService] Lat: \(lat), Lon: \(lon)")
    
    // Send to backend
    sendLocationToBackend(lat: lat, lon: lon)
    
    // Notify React Native if subscribed
    onLocationUpdate?(lat, lon)
  }
  
  func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
    print("❌ [LocationService] Location error: \(error.localizedDescription)")
  }

  // MARK: - Persistence & Backend
  
  private func saveToken(token: String) {
    UserDefaults.standard.set(token, forKey: KEY_AUTH_TOKEN)
  }

  private func getSavedToken() -> String? {
    return UserDefaults.standard.string(forKey: KEY_AUTH_TOKEN)
  }

  private func clearToken() {
    UserDefaults.standard.removeObject(forKey: KEY_AUTH_TOKEN)
  }

  private func sendLocationToBackend(lat: Double, lon: Double) {
    // ✅ Fallback: If instance token is nil, try loading from storage.
    // This handles the case where the app was restarted in the background.
    guard let token = self.authToken ?? getSavedToken() else {
      print("❌ [LocationService] No auth token found. Cannot send location.")
      return
    }
    
    let url = URL(string: "http://10.72.0.124:4167/location")!
    let json: [String: Any] = ["lat": lat, "lon": lon]
    
    do {
      let jsonData = try JSONSerialization.data(withJSONObject: json)
      var request = URLRequest(url: url)
      request.httpMethod = "POST"
      request.httpBody = jsonData
      request.setValue("application/json", forHTTPHeaderField: "Content-Type")
      request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
      
      URLSession.shared.dataTask(with: request) { data, response, error in
        if let error = error {
          print("❌ [LocationService] Error sending location: \(error.localizedDescription)")
          return
        }
        if let httpResponse = response as? HTTPURLResponse {
          print("✅ [LocationService] Server responded: \(httpResponse.statusCode)")
        }
      }.resume()
      
    } catch {
      print("❌ [LocationService] JSON Error: \(error.localizedDescription)")
    }
  }
}