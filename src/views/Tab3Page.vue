<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>History</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-refresher
        slot="fixed"
        @ionRefresh="handleRefresh($event)"
      >
        <ion-refresher-content />
      </ion-refresher>
      
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            History
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <LocationList :locations="profileLocations" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { Session } from '../types';

import axios from 'axios';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonRefresher,
  IonRefresherContent
} from '@ionic/vue';
import { ref, inject, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import LocationList from '../components/LocationList.vue';

const router = useRouter();
const session = inject<{value: Session | null}>('session');
const profile = inject('profile');
const profileLocations = ref([]);

const fetchProfileLocations = async (id: string) => {
  try {
    const response = await axios.get(`/api/v2/profile/locations/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

const handleRefresh = (e: CustomEvent) => {
  setTimeout(async () => {
    if (profile.value) {
      profileLocations.value = await fetchProfileLocations(
        profile.value.id);
    }
    e.target.complete();
  }, 2000);
}

watchEffect(async () => {
  if (profile.value) {
    profileLocations.value = await fetchProfileLocations(
      profile.value.id);
  }
});

</script>
