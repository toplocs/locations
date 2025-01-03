<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import axios from 'axios';
import storage from './StorageService';
import { ref, provide, onBeforeMount } from 'vue';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { Session, User, Profile, Location } from './types';

const serverURL = '//localhost:3000';
const session = ref<Session | null>(null);
const user = ref<User | null>(null);
const profile = ref<Profile | null>(null);
const location = ref<Location | null>(null);

provide('session', session);
provide('user', user);
provide('profile', profile);
provide('location', location);
provide('storage', storage);

axios.defaults.baseURL = serverURL;
</script>
