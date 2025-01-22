<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Your Profile
        </ion-title>
        <ion-button
          fill="outline"
          slot="end"
          routerLink="/tabs/tab1/settings"
        > <ion-icon :icon="pencil" />
        </ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            Your Profile
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <SelectProfile
        :profiles="profiles"
        :locations="locations"
      />

      <br/>

      <ion-item>
        <ion-label>
          <ion-chip
            v-for="x of locations"
            :color="x.key == 'current' ? 'primary': 'medium'"
            @click="() => fetchLocation(x)"
          > {{ x.Location.title }}
          </ion-chip>
        </ion-label>
      </ion-item>

      <LocationDetails
        v-if="location"
        :location="location.Location"
        :locationData="locationData"
        :status="location.key"
      />

      <ion-button
        @click="logout"
        shape="round"
        expand="full"
        color="danger"
      > Logout
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
  import { Profile } from '../types';

  import axios from 'axios';
  import {
    IonPage, 
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonItem,
    IonLabel,
    IonChip,
    IonIcon,
  } from '@ionic/vue';
  import { pencil } from 'ionicons/icons';
  import { ref, inject, onMounted, watchEffect } from 'vue';
  import { useRouter } from 'vue-router';
  import storage from '@/StorageService';
  import SelectProfile from '@/components/SelectProfile.vue';
  import LocationDetails from '@/components/LocationDetails.vue';

  const router = useRouter();
  const profile = inject('profile');
  const profiles = ref<Profile[]>([]);
  const location = ref<Location>(null);
  const locationData = ref<ProfileLocation[]>([]);
  const locations = ref<Location[]>([]);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get(`/api/profile`);

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  const logout = async () => {
    try {
      //if (session) session.value = null;
      axios.defaults.headers.common['Authorization'] = null;
      profile.value = null;
      await storage.remove('authHeader');
      router.push('/login');
    } catch (error) {
      console.error(error);
    }
  }

  const fetchProfileLocations = async (id: string) => {
    try {
      const response = await axios.get(`/api/v2/profile/locations/${id}`);

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  const fetchLocationProfiles = async (id: string) => {
    try {
      const response = await axios.get(`/api/v2/location/${id}/profiles`);

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  const fetchLocation = async (x: ProfileLocation) => {
    location.value = x;
    locationData.value = await fetchLocationProfiles(x.Location.id);
    console.log(locationData.value)
  }

  watchEffect(async () => {
    if (profile.value) {
      locations.value = await fetchProfileLocations(profile.value.id);
      location.value = locations.value.find(x => x.key == 'current');
      await fetchLocation(location.value);
    }
  });

  onMounted(async () => {
    profiles.value = await fetchProfiles();
  });
</script>
