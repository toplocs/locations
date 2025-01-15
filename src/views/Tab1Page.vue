<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Profiles</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            Profiles
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <ProfileList :profiles="profiles" />

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
import { ref, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonPage, 
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from '@ionic/vue';
import storage from '../StorageService';
import ProfileList from '../components/ProfileList.vue';

const router = useRouter();
const session = inject<{value: Session | null}>('session');
const profile = inject('profile');
const profiles = ref<Profile[]>([]);

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
    if (session) session.value = null;
    axios.defaults.headers.common['Authorization'] = null;
    profile.value = null;
    await storage.remove('authHeader');
    router.push('/login');
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  profiles.value = await fetchProfiles();
});
</script>
