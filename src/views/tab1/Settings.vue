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
</script>
