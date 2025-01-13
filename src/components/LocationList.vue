<template>
  <ion-list>
    <ion-item v-for="x of locations" :key="x.id">
      
      <ion-button size="small" slot="start" color="medium">
        <ion-icon aria-hidden="true" :icon="pin" />
      </ion-button>

      <ion-label>
        <p>{{x.Location.title}}</p>
      </ion-label>

      <ion-chip
        v-if="x.key == 'current'"
        color="primary"
      > Currently at
      </ion-chip>
      <ion-chip
        v-if="x.key == 'past'"
        color="secondary"
      > Have been here
      </ion-chip>
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
    IonButton,
    IonIcon
  } from '@ionic/vue';
  import { pin } from 'ionicons/icons';
  import { inject } from 'vue';
  import { Profile } from '../toplocs';

  const props = defineProps<{
    locations: ProfileLocation[];
  }>();

  const profile =  inject('profile');

  const selectProfile = async (e: Event, selected: Profile) => {
    profile.value = selected;
  }

</script>