<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>History</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Location History</ion-title>
        </ion-toolbar>
      </ion-header>

      <ExploreContainer name="Location history" />

      <ion-button @click="logout" shape="round" expand="full">
        Logout
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import axios from 'axios';
import { inject } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import { Session } from '../types';
import ExploreContainer from '../components/ExploreContainer.vue';

const router = useRouter();
const session = inject<{value: Session | null}>('session');

const logout = async () => {
  try {
    if (session) session.value = null;
    axios.defaults.headers.common['Authorization'] = null;
    //profile.value = null;
    //localStorage.removeItem('authHeader');
    router.push('/login');
  } catch (error) {
    console.error(error);
  }
}
</script>
