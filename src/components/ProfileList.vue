<template>
  <ion-list>
    <ion-item v-for="profile of profiles">
      <ion-avatar slot="start">
        <img :src="profile.image" />
      </ion-avatar>

      <ion-label>
        <p>{{profile.username}} – {{profile.type}}</p>

        <ion-chip
          color="primary"
          v-for="location of profile.locations"
        >
          {{ location.title }}
        </ion-chip>
      </ion-label>
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
  } from '@ionic/vue';
  import { defineComponent } from 'vue';

  const props = defineProps({
    profiles: {
      type: Array,
      required: true,
    }
  });


</script>