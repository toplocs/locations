<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Location
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            Location
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <LocationDetails
        v-if="location"
        :location="location"
        :locationData="locationData"
        status="not defined"
      />
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
  import { ref, watchEffect } from 'vue';
  import { useRoute } from 'vue-router';
  import LocationDetails from '@/components/LocationDetails.vue';

  const route = useRoute();
  const locationId = ref(route.params.id as string);
  const location = ref<Location>(null);
  const locationData = ref<ProfileLocation[]>([]);

  const fetchLocation = async (id: string) => {
    try {
      const response = await axios.get(`/api/location/byId/${id}`);

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  watchEffect(async () => {
    if (locationId.value) {
      location.value = await fetchLocation(locationId.value);
    }
  });
</script>
