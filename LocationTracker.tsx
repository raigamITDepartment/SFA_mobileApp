import React, { useEffect, useState } from 'react';
import { View, Button, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';

const LOCATION_TASK_NAME = 'background-location-task';

const requestPermissions = async () => {
  const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
  if (foregroundStatus === 'granted') {
    const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
    if (backgroundStatus === 'granted') {
      return true;
    }
  }
  return false;
};

const LocationTracker = () => {
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const trackingStatus = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
      setIsTracking(trackingStatus);
    };
    checkStatus();
  }, []);

  const toggleTracking = async () => {
    const currentlyTracking = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);

    if (currentlyTracking) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      console.log('Location tracking stopped');
      setIsTracking(false);
    } else {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) {
        Alert.alert("Permissions not granted", "Background location tracking requires permissions.");
        return;
      }

      // For time-based updates, set timeInterval and distanceInterval to 0 if you want updates only based on time.
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.LocationAccuracy.Balanced,
        timeInterval: 60000, // 60 seconds
        distanceInterval: 0, // Receive updates regardless of distance
        showsBackgroundLocationIndicator: true,
        foregroundService: Platform.OS === 'android' ? {
          notificationTitle: 'Tracking your location',
          notificationBody: 'Your location is being tracked for the app.',
          notificationColor: '#ff0000'
        } : undefined,
      });
      console.log('Location tracking started');
      setIsTracking(true);
    }
  };

  return (
    <View style={{ margin: 16 }}>
      <Button
        title={isTracking ? 'Stop Background Tracking' : 'Start Background Tracking'}
        onPress={toggleTracking}
      />
    </View>
  );
};

export default LocationTracker;