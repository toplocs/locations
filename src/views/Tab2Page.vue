<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          {{selection?.title || 'Current location'}}
        </ion-title>
        <ion-button
          fill="outline"
          slot="end"
          :disabled="!selection"
          @click="openModal"
        > <ion-icon :icon="add" />
        </ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <MapComponent />
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
  import { ref, provide } from 'vue';
  import { modalController } from '@ionic/vue';
  import MapComponent from '@/components/MapComponent.vue';
  import NewLocationModal from '@/components/map/NewLocationModal.vue';

  const selection = ref(null);

  const openModal = async (event: Event) => {
    if (selection.value) {
      const modal = await modalController.create({
        component: NewLocationModal,
        componentProps: { location: selection.value },
        event: event,
        initialBreakpoint: 0.5,
        breakpoints: [0, 0.25, 0.5, 0.75, 1],
      });
      modal.present();

      const { data, role } = await modal.onWillDismiss();
      if (data) console.log(data, role); //add location to the map component
    }
  }

  provide('selection', selection);
</script>
