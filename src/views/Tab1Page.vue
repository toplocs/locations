<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Your Profile
        </ion-title>
        <ion-button
          fill="outline"
          slot="end"
          routerLink="/tabs/tab1/settings"
        > <ion-icon :icon="pencil" />
        </ion-button>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            Your Profile
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <SelectProfile
        :profiles="profiles"
        :locations="locations"
      />

      <br/>

      <ion-item>
        <ion-label>
          <ion-chip
            v-for="x of locations"
            :color="x.key == 'current' ? 'primary': 'medium'"
            @click="() => fetchLocation(x)"
          > {{ x.Location.title }}
          </ion-chip>
        </ion-label>
      </ion-item>

      <LocationDetails
        v-if="location"
        :location="location"
        :status="relationKey"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
  import { Profile } from '../types';
  import axios from 'axios';
  import {
    IonPage, 
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonItem,
    IonLabel,
    IonChip,
    IonIcon,
  } from '@ionic/vue';
  import { pencil } from 'ionicons/icons';
  import { ref, inject, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import SelectProfile from '../components/SelectProfile.vue';
  import LocationDetails from '../components/LocationDetails.vue';

  const router = useRouter();
  const profile = inject('profile');
  const current = inject('current');
  const profiles = ref<Profile[]>([]);
  const location = ref<Location>(null);
  const locations = ref<Location[]>([]);
  const relationKey = ref<String>('current');

  const fetchProfiles = async () => {
    try {
      const response = await axios.get(`/api/profile`);

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  const findProfileLocations = async (id: string) => {
    try {
      const response = await axios.get(`/api/v2/profile/locations/${id}`);

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  const findCurrent = (id: string) => {
    const data = locations.value.find(x => x.key == 'current');

    return data?.Location;
  }

  const fetchLocation = async (next: ProfileLocation) => {
    location.value = next.Location;
    relationKey.value = next.key;
  }

  watch(profile, async() => {
    if (profile.value) {
      locations.value = await findProfileLocations(profile.value.id);
      location.value = findCurrent();
    }
  });

  watch(current, async () => {
    if (current.value) {
      location.value = current.value;
    }
  });

  /*
  watchEffect(async () => {
    console.log('Effect')
    if (profile.value) {
      locations.value = await findProfileLocations(profile.value.id);
      location.value = locations.value.find(x => x.key == 'current');
      await fetchLocation(location.value);
    }
  });
  */

  onMounted(async () => {
    profiles.value = await fetchProfiles();
    if (!profile.value) profile.value = profiles.value[0];
    if (current.value) location.value = current.value;
  });
</script>
