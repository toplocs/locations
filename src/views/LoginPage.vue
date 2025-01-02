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
            fill="outline"
          ></ion-input>
        </ion-item>

        <ion-item class="ion-margin-bottom" lines="none">
          <ion-input
            name="password"
            type="password"
            label="Passwort"
            fill="outline"
          ></ion-input>
        </ion-item>

        <ion-button type="submit" shape="round" expand="full">
          Login
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
import storage from '../StorageService.ts';

const router = useRouter();
const session = inject('session');
const profile = inject('profile');
const errorMessage = ref('');
const form = ref<HTMLFormElement | null>(null);

const getSession = async (authHeader: string) => {
  try {
    const response = await axios.get(`/api/auth`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });
    const { session } = response.data;
    console.log(session)

    return session;
  } catch (e) {
    console.error(e);
  }
}

const sendLogin = async () => {
  try {
    const formData = new FormData(form.value ?? undefined);
    const response = await axios.post(`/api/auth/login`, formData);

    return response.data;
  } catch (error) {
    errorMessage.value = error.response.data;
    console.error(error);
  }
}

const onSubmit = async () => {
  if (!form.value) return;
  errorMessage.value = '';
  try {
    const authHeader = await sendLogin();
    if (authHeader) {
      axios.defaults.headers.common['Authorization'] = JSON.stringify(authHeader);
      await storage.set('authHeader', JSON.stringify(authHeader));
      session.value = await getSession(JSON.stringify(authHeader));

      if (profile.value) return router.push(`/tabs`);
      return router.push(`/tabs`);
    }
  } catch (error) {
    errorMessage.value = error.response.data;
    console.error(error);
  }
}
</script>
