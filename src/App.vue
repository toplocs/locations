<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import axios from 'axios';
import storage from './StorageService.ts';
import { ref, provide, onBeforeMount } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useRouter } from 'vue-router';

const serverURL = '//localhost:3000';
const router = useRouter();
const session = ref(null);
const user = ref(null);
const profile = ref(null);
const location = ref(null);
const interest = ref(null);

provide('session', session);
provide('user', user);
provide('profile', profile);
provide('location', location);
provide('interest', interest);
provide('storage', storage);

axios.defaults.baseURL = serverURL;
</script>
