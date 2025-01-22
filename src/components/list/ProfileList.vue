<template>
  <ion-list>
    <ion-item v-for="x of profiles" :key="x.id">
    
      <ion-avatar slot="start">
        <img :src="x.image" />
      </ion-avatar>

      <ion-checkbox
        :checked="profile?.id == x.id"
        :disabled="profile?.id == x.id"
        @ionChange="(e) => selectProfile(e, x)"
      >
        <ion-label>
          <p>{{x.username}} – {{x.type}}</p>

          <ion-chip
            color="primary"
            v-for="location of x.locations"
          >
            {{ location.title }}
          </ion-chip>
        </ion-label>
      </ion-checkbox>
    </ion-item>
  </ion-list>
</template>

<script setup lang="ts">
  import {
    IonItem,
    IonLabel,
    IonList,
    IonAvatar,
    IonChip,
    IonCheckbox,
  } from '@ionic/vue';
  import { inject } from 'vue';
  import storage from '../StorageService';
  import { Profile } from '../toplocs';

  const props = defineProps<{
    profiles: Profile[];
  }>();

  const profile =  inject('profile');

  const selectProfile = async (e: Event, selected: Profile) => {
    profile.value = selected;
    await storage.set('profile', selected.id);
  }


</script>