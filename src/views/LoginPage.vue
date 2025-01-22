<template>
  <ion-page>
    <form
      ref="form"
      @submit.prevent="onSubmit"
      class="flex flex-col gap-4"
    >
      <ion-list class="ion-margin-top">
        <ion-list-header class="ion-margin-top">
          <ion-label>Login</ion-label>
        </ion-list-header>

        <ion-item v-if="errorMessage" class="ion-margin-bottom" lines="none">
           {{ errorMessage }}
        </ion-item>

        <ion-item class="ion-margin-bottom" lines="none">
          <ion-input
            name="username"
            type="text"
            label="Email"
            labelPlacement="fixed"
            fill="outline"
          ></ion-input>
        </ion-item>

        <ion-item class="ion-margin-bottom" lines="none">
          <ion-input
            name="password"
            type="password"
            label="Passwort"
            labelPlacement="fixed"
            fill="outline"
          ></ion-input>
        </ion-item>

        <ion-button
          class="ion-padding"
          type="submit"
          shape="round"
          expand="full"
        > Login
        </ion-button>
      </ion-list>
    </form>
  </ion-page>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonList,
  IonItem,
  IonListHeader,
  IonInput,
  IonLabel,
  IonIcon,
  IonPage,
  IonButton
} from '@ionic/vue';
import storage from '../StorageService';
import { Session, Profile } from '../types';

const router = useRouter();
const session = inject<{value: Session}>('session');
const profile = inject<{value: Profile}>('profile');
const errorMessage = ref('');
const form = ref<HTMLFormElement | null>(null);

const sendLogin = async () => {
  try {
    const formData = new FormData(form.value ?? undefined);
    const response = await axios.post(`/api/auth/login`, formData);

    return response.data;
  } catch (error) {
    errorMessage.value = (error as any).response?.data || 'An error occurred';
    console.error(error);
  }
}

const getSession = async (authHeader: string) => {
  let session: Session | null = null;
  try {
    const response = await axios.get(`/api/auth`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });
    session = response.data.session;
  } catch (e) {
    console.error(e);
  }
  if (!session) throw new Error('Invalid session');  
  return session;
}

const onSubmit = async () => {
  if (!form.value) return;
  errorMessage.value = '';
  try {
    let authHeader = await sendLogin();
    if (authHeader) {
      authHeader = JSON.stringify(authHeader);
      axios.defaults.headers.common['Authorization'] = authHeader;
      await storage.set('authHeader', authHeader);

      if (session) session.value = await getSession(authHeader);
      if (profile && profile.value) return router.push(`/tabs`);
      
      return router.push(`/tabs`);
    }
  } catch (error) {
    errorMessage.value = (error as any).response?.data || 'An error occurred';
    console.error(error);
  }
}
</script>
