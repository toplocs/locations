<template>
  <ion-list>
    <ion-item v-for="profile of profiles">
      <ion-avatar slot="start">
        <img alt="Silhouette of a person's head" :src="profile.image" />
      </ion-avatar>
      <ion-label>
        {{profile.username}} – {{profile.type}}
      </ion-label>
    </ion-item>
  </ion-list>
</template>

<script setup lang="ts">
  import {
    IonItem,
    IonLabel,
    IonList,
    IonAvatar
  } from '@ionic/vue';
  import { defineComponent } from 'vue';

  const props = defineProps({
    profiles: {
      type: Array,
      required: true,
    }
  });


</script>