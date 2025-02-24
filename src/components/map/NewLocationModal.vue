<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons slot="end">
        <ion-button @click="cancel">Close</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <CreateLocation
      :coordinate="coordinate"
      :close="confirm"
    />
  </ion-content>
</template>

<script lang="ts" setup>
  import {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonButton,
    IonItem,
    IonInput,
    modalController,
  } from '@ionic/vue';
  import { ref, computed } from 'vue';
  import CreateLocation from '@/components/CreateLocation.vue';

  const props = defineProps<{
    location: Location;
  }>();
  const coordinate = computed(() => ({
    lat: props.location.coordinate?.lat,
    lng: props.location.coordinate?.lng,
    zoom: props.location.zoom,
  }));

  const cancel = () => modalController.dismiss(null, 'cancel');
  const confirm = (location: Location) => modalController.dismiss(location, 'confirm');
</script>