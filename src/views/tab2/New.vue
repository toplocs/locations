<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          New Location
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            New Location
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <CreateLocation :coordinate="coordinate" />
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
    IonContent
  } from '@ionic/vue';
  import { ref, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import CreateLocation from '@/components/CreateLocation.vue';

  const route = useRoute();
  const coordinate = computed(() => ({
    lat: route.query.lat,
    lng: route.query.lng,
  }));

</script>
