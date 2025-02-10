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
          name="username"
          label="Profile name:"
          label-placement="fixed"
          placeholder="Enter the profile name"
          :value="profile?.username"
        />
      </ion-item>

      <ion-item>
        <ion-input
          name="type"
          label="Profile type:"
          label-placement="fixed"
          placeholder="Enter the profile type"
          :value="profile?.type"
        />
      </ion-item>

      <ion-item>
        <ion-input
          name="email"
          type="email"
          label="Profile email:"
          label-placement="fixed"
          placeholder="Enter the profile email"
          :value="profile?.email"
        />
      </ion-item>

      <ion-item>
        <ion-input
          name="about"
          type="textarea"
          label="About you:"
          label-placement="fixed"
          placeholder="Say something about yourself"
          :value="profile?.about"
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
  import { ref, inject, onMounted } from 'vue';
  
  const profile = inject('profile');
  const errorMessage = ref('');
  const successMessage = ref('');
  const form = ref<HTMLFormElement | null>(null);

  const fetchProfile = async (id: string) => {
    try {
      const response = await axios.get(`/api/profile/byId/${id}`);

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  const onSubmit = async () => {
    try {
      const formData = new FormData(form.value ?? undefined);
      const response = await axios.put(`/api/profile/${profile.value.id}`, formData);
      successMessage.value = 'Your settings have been changed!';
      profile.value = {
        ...profile.value,
        ...response.data,
      }

      return response.data;
    } catch (error) {
      console.error(error);
      errorMessage.value = error.response.data;
    }
  }

  onMounted(async () => {
    profile.value = await fetchProfile(profile.value.id);
  });

</script>