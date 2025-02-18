<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import axios from 'axios';
import storage from './StorageService';
import { ref, inject, provide, watch, onMounted } from 'vue';
import { IonApp, IonRouterOutlet, toastController } from '@ionic/vue';
import { Geolocation } from '@capacitor/geolocation';
import { User, Profile, Location } from './types';

const serverURL = import.meta.env.VITE_SERVER_URL;
const user = ref<User | null>(null);
const profile = ref<Profile | null>(null);
const location = ref<Location | null>(null);
const current = ref<Location | null>(null);

const getProfile = async () => {
  try {
    const profileId = await storage.get('profile');
    if (!profileId) return null;
    const response = await axios.get(`/api/profile/${profileId}`);

    return response.data;
  } catch (e) {
    console.error(e);
  }
}

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

const updateCurrentLocation = async (lat, lng) => {
  try {
    const response = await axios.post(`/api/v2/location/update/${profile.value?.id}`,
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

provide('user', user);
provide('profile', profile);
provide('location', location);
provide('current', current);
provide('storage', storage);

watch(location, async () => {
  if (location.value) {
    console.log(location.value, 'Location has been updated');
  }
});

watch(current, async () => {
  if (current.value) {
    const toast = await toastController.create({
      message: `Your current location is now ${current.value?.title}`,
      duration: 3000,
      position: 'top',
    });

    await toast.present();
  }
});

watch(profile, async () => {
  if (profile.value) {
    location.value = await getLocation();
    current.value = await updateCurrentLocation(
      location.value?.latitude,
      location.value?.longitude,
    );
  }
});

onMounted(async () => {
  profile.value = await getProfile();

  Geolocation.watchPosition({

  }, async (position) => {
    if (position) {
      current.value = await updateCurrentLocation(
        position.coords.latitude,
        position.coords.longitude,
      );
    }
  });
});

axios.defaults.baseURL = serverURL;
</script>
