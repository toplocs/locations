<template>
  <ion-content class="ion-padding">
    <h3>{{location.title}}</h3>

    <ion-button
      :routerLink="`/tabs/tab2/location/${location.id}`"
      @click="closePopover"
    >
      Show details
    </ion-button>
  </ion-content>
</template>

<script setup lang="ts">
  import {
    IonContent,
    IonButton, 
    popoverController
  } from '@ionic/vue';

  const props = defineProps<{
    location: Location;
  }>();

  const closePopover = () => {
    popoverController.dismiss(null, 'confirm');
  }
</script>