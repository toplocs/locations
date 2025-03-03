<template>
  <ion-page>
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <ion-icon aria-hidden="true" :icon="people" />
          <ion-label>Me</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/tab2">
          <ion-icon aria-hidden="true" :icon="map" />
          <ion-label>Map</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/tab3">
          <ion-icon aria-hidden="true" :icon="book" />
          <ion-label>History</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
  import { watch, onMounted } from 'vue';
  import {
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonLabel,
    IonIcon,
    IonPage,
    IonRouterOutlet,
    toastController
  } from '@ionic/vue';
  import { people, map, book } from 'ionicons/icons';
  import { Geolocation } from '@capacitor/geolocation';
  import { useUser } from '@/composables/user';
  import { useProfile } from '@/composables/profile';
  import { useLocation } from '@/composables/location';

  const { user, getUser } = useUser();
  const { profile, getProfile } = useProfile();
  const {
    location,
    current,
    getLocation,
    updateCurrentLocation
  } = useLocation();

  watch(() => current, async () => {
    if (current.value) {
      const toast = await toastController.create({
        message: `Your current location is now ${current.value?.title}`,
        duration: 3000,
        position: 'top',
      });

      await toast.present();
    }
  });

  onMounted(async () => {
    profile.value = await getProfile();
    location.value = await getLocation();

    Geolocation.watchPosition({
      //config
    }, async (position) => {
      if (position && profile.value) {
        console.log('update current')
        current.value = await updateCurrentLocation(
          profile.value.id,
          position.coords.latitude,
          position.coords.longitude,
        );
      }
    });
  });
</script>
