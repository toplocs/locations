<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 1</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Profile</ion-title>
        </ion-toolbar>
      </ion-header>

      <ProfileList :profiles="profiles" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { Profile } from '../types';

const profiles = ref<Profile[]>([]);

const fetchProfiles = async () => {
  try {
    const response = await axios.get(`/api/profile`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  profiles.value = await fetchProfiles();
  console.log(profiles.value);
});
</script>
