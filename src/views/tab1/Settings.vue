<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Settings
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            Settings
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <ProfileSettings />

      <ion-button
        @click="update"
        class="ion-padding"
      > Update current
      </ion-button>

      <ion-button
        @click="logout"
        color="danger"
        class="ion-padding"
      > Logout
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
  import axios from 'axios';
  import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton
  } from '@ionic/vue';
  import { ref, inject } from 'vue';
  import { useRouter } from 'vue-router';
  import storage from '@/StorageService';
  import ProfileSettings from '@/components/ProfileSettings.vue';

  const router = useRouter();
  const session = inject('session');
  const profile = inject('profile');
  const location = inject('location');
  const current = inject('current');

  const logout = async () => {
    try {
      if (session) session.value = null;
      if (profile) profile.value = null;
      axios.defaults.headers.common['Authorization'] = null;
      await storage.remove('authHeader');
      router.push('/login');
    } catch (error) {
      console.error(error);
    }
  }

  const update = async () => {
    if (location.value) {
      current.value = await updateCurrentLocation(
        location.value?.latitude,
        location.value?.longitude,
      );
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
</script>
