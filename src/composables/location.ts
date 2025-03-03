import axios from 'axios';
import { ref, inject, provide, watch } from 'vue';
import { Preferences } from '@capacitor/preferences';
import { Geolocation } from '@capacitor/geolocation';

export function locationProvider() {
  const location = ref<Location | null>(null);
  const current = ref<Location | null>(null);

  const getLocation = async () => {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;

      return { latitude: lat, longitude: lng };
    } catch(e) {
      console.warn(e);
    }
  }

  const updateCurrentLocation = async (
    profileId: string,
    lat: string,
    lng: string,
  ) => {
    try {
      const response = await axios.post(`/api/v2/location/update/${profileId}`,
      {
        lat: lat,
        lng: lng
      });

      return response.data?.Location;
    } catch (error) {
      console.error(error);
      return { error: error.message };
    }
  }

  watch(location, async () => {
    if (location.value) {
      //console.log(location.value, 'Location has been updated');
    }
  });

  provide('location', {
    location,
    current,
    getLocation,
    updateCurrentLocation
  });
}

export function useLocation() {
  const location = inject('location');

  if (!location) {
    throw new Error('Composable must have an location provider.');
  }

  return location;
}