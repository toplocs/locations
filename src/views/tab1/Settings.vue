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

      <ProfileSettings :profile="profile" />

      <ion-button
        @click="handleLogout"
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
  import storage from '@/services/storageService';
  import ProfileSettings from '@/components/ProfileSettings.vue';
  import { useUser } from '@/composables/user';
  import { useProfile } from '@/composables/profile';

  const { logout } = useUser();
  const { profile, setProfile } = useProfile();

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      await setProfile(null);

      router.push('/login');
    } catch (error) {
      console.error(error);
    }
  }
</script>
