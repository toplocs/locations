<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Map
        </ion-title>
        <ion-button
          fill="outline"
          slot="end"
          :routerLink="
          `/tabs/tab2/new?lat=${myLocation?.coordinate.lat}&lng=${myLocation?.coordinate.lng}`"
        > <ion-icon :icon="add" />
        </ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            Map
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <MapComponent  @updateLocation="updateMyCoordinate" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
  import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
  } from '@ionic/vue';
  import { add } from 'ionicons/icons';
  import { ref, onMounted } from 'vue';
  import { Geolocation } from '@capacitor/geolocation';
  import MapComponent from '@/components/MapComponent.vue';

  const myLocation = ref(null);

  const updateMyCoordinate = (data: Object) => {
    myLocation.value = data.value;
  }
</script>
