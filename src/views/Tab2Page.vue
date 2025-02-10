<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          {{selection?.title || 'Current location'}}
        </ion-title>
        <ion-button
          v-if="selection"
          fill="outline"
          slot="end"
          :routerLink="
          `/tabs/tab2/new?lat=${selection?.coordinate.lat}&lng=${selection?.coordinate.lng}&zoom=${selection?.zoom}`"
        > <ion-icon :icon="add" />
        </ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <MapComponent 
        @updateLocation="updateSelection"
      />
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
  import { ref, inject } from 'vue';
  import MapComponent from '@/components/MapComponent.vue';

  const selection = ref(null);

  const updateSelection = (data: object) => {
    selection.value = data.value;
  }
</script>
