<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import axios from 'axios';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
const serverURL = '//localhost:3000';

axios.defaults.baseURL = serverURL;
//axios.defaults.headers.common['Authorization'] = authHeader;
</script>
