<template>
  <ion-list>
    <form
      ref="form"
      @submit.prevent="onSubmit"
    >
      <ion-item v-if="errorMessage" class="text-red-500 mt-4">
        {{ errorMessage }}
      </ion-item>

      <ion-item>
        <ion-input
          name="xCoordinate"
          label="Latitude:"
          label-placement="fixed"
          placeholder="Enter the latitude"
          :value="coordinate?.lat"
          :readonly="true"
        />
      </ion-item>

      <ion-item>
        <ion-input
          name="yCoordinate"
          label="Longitude:"
          label-placement="fixed"
          placeholder="Enter the longitude"
          :value="coordinate?.lng"
          :readonly="true"
        />
      </ion-item>

      <ion-item>
        <ion-input
          name="zoom"
          label="Zoom:"
          label-placement="fixed"
          placeholder="Enter the zoom level"
          :value="10"
          :readonly="true"
        />
      </ion-item>

      <ion-item>
        <ion-input
          name="title"
          label="Title:"
          label-placement="fixed"
          placeholder="Enter the title"
        />
      </ion-item>

      <ion-button type="submit" class="ion-padding">
        Submit
      </ion-button>
    </form>
  </ion-list>
</template>

<script setup lang="ts">
  import axios from 'axios';
  import {
    IonInput,
    IonItem,
    IonList,
    IonButton,
  } from '@ionic/vue';
  import { ref, inject } from 'vue';
  import { useRouter } from 'vue-router';

  const props = defineProps<{
    coordinate: Object;
  }>();
  const router = useRouter();
  const profile = inject('profile');
  const errorMessage = ref('');
  const form = ref<HTMLFormElement | null>(null);

  const addLocation = async (locationId: string) => {
    try {
      const response = await axios.put(`/api/location/add`, {
        profileId: profile.value?.id,
        locationId: locationId,
      });
    } catch (error) {
      console.error(error);
    }
  }

  const onSubmit = async () => {
    if (!form.value) return;
    errorMessage.value = '';
    try {
      const formData = new FormData(form.value);
      formData.append('access', '0');
      const response = await axios.post(`/api/location`, formData);
      await addLocation(response.data?.id);
      profile.value.locations = [
        ...profile.value.locations, response.data
      ];

      return router.push(`/tabs/tab2/location/${response.data?.id}`);
    } catch (error) {
      console.error(error);
      errorMessage.value = error.response.data;
    }
  }

</script>