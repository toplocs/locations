<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import axios from 'axios';
import storage from './StorageService';
import { ref, inject, provide, onMounted } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { Geolocation } from '@capacitor/geolocation';
import { User, Profile, Location } from './types';

const serverURL = import.meta.env.VITE_SERVER_URL;
const user = ref<User | null>(null);
const profile = ref<Profile | null>(null);
const location = ref<Location | null>(null);

const getProfile = async () => {
  try {
    const profileId = await storage.get('profile');
    if (!profileId) return null;
    const response = await axios.get(`/api/profile/byId/${profileId}`);

    return response.data;
  } catch (e) {
    console.error(e);
  }
}

const getLocation = async () => {
  const coordinates = await Geolocation.getCurrentPosition();
  const lat = coordinates.coords.latitude;
  const lng = coordinates.coords.longitude;

  return { latidude: lat, longitude: lng };
}

provide('user', user);
provide('profile', profile);
provide('location', location);
provide('storage', storage);

onMounted(async () => {
  profile.value = await getProfile();
  location.value = await getLocation();
  console.log(location.value);
});

axios.defaults.baseURL = serverURL;
</script>
