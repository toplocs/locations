<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
  import axios from 'axios';
  import { IonApp, IonRouterOutlet } from '@ionic/vue';
  import { User, Profile, Location } from './types';
  import { userProvider } from '@/composables/user';
  import { profileProvider } from '@/composables/profile';
  import { locationProvider } from '@/composables/location';

  userProvider();
  profileProvider();
  locationProvider();

  const serverURL = import.meta.env.VITE_SERVER_URL;
  axios.defaults.baseURL = serverURL;
</script>
