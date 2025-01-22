<template>
  <ion-item>
    <ion-avatar slot="start">
      <img :src="profile?.image" />
    </ion-avatar>

    <ion-label>
      <ion-select
        aria-label="Select your profile"
        placeholder="Select your profile"
        justify="start"
        interface="action-sheet"
        :value="profile?.id"
        @ionChange="(e) => selectProfile(e, x)"
      >
        <ion-select-option
          v-for="x of profiles"
          :value="x.id"
        > {{x.username}} – {{x.type}}
        </ion-select-option>
      </ion-select>
      <p>{{ profile?.about }}</p>
    </ion-label>
  </ion-item>
</template>

<script setup lang="ts">
  import {
    IonItem,
    IonLabel,
    IonAvatar,
    IonSelect,
    IonSelectOption
  } from '@ionic/vue';
  import { inject } from 'vue';
  import storage from '../StorageService';
  import { Profile } from '../toplocs';

  const props = defineProps<{
    profiles: Profile[];
    locations: Location[];
  }>();

  const profile = inject('profile');

  const selectProfile = async (e: CustomEvent) => {
    const selected = props.profiles.find(x => x.id == e.detail.value);
    profile.value = selected;
    await storage.set('profile', selected.id);
  }


</script>