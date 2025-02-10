<template>
  <ion-list>
    <ion-item v-for="x of locations" :key="x.id">
      
      <ion-button
        size="small"
        slot="start"
        :disabled="x.key == 'current'"
        @click="presentAlert(x)"
      >
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
      > {{ formatter.format(new Date()) }}
      </ion-chip>
    </ion-item>
  </ion-list>
</template>

<script setup lang="ts">
  import axios from 'axios';
  import {
    IonItem,
    IonLabel,
    IonList,
    IonAvatar,
    IonChip,
    IonCheckbox,
    IonButton,
    IonIcon,
    IonAlert
  } from '@ionic/vue';
  import { pin } from 'ionicons/icons';
  import { inject } from 'vue';
  import { alertController } from '@ionic/vue';
  import { Profile } from '../toplocs';

  const props = defineProps<{
    locations: ProfileLocation[];
  }>();
  const formatter = new Intl.DateTimeFormat('de-DE', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const profile = inject('profile');
  const current = inject('current');

  const updateCurrentLocation = async (lat, lng) => {
    try {
      const response = await axios.post(`/api/v2/location/update/${profile.value?.id}`,
      {
        lat: lat,
        lng: lng
      });

      return response.data?.Location;
    } catch (error) {
      console.error(error);
      return { error: error.message };
    }
  }

  const presentAlert = async (x: ProfileLocation) => {
    const alert = await alertController.create({
      header: `Notification`,
      message: `Do you want to set your current location to ${x.Location.title}?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          role: 'confirm',
          handler: async () => {
            current.value = await updateCurrentLocation(
              x.Location.latitude,
              x.Location.longitude
            );
            props.locations.map(x => x.key = 'past');
            x.key = 'current';
          },
        },
      ],
    });

    await alert.present();
  }

</script>