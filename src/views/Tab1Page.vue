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
      <ion-refresher
        slot="fixed"
        @ionRefresh="handleRefresh($event)"
      >
        <ion-refresher-content />
      </ion-refresher>

      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">
            Your Profile
          </ion-title>
        </ion-toolbar>
      </ion-header>

      <SelectProfile :profiles="profiles" />

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

      <div ref="locationDetails">
        <LocationDetails
          v-if="location"
          :location="location"
          :status="relationKey"
        />
      </div>
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
    IonRefresher,
    IonRefresherContent,
    IonSelect,
    IonSelectOption,
  } from '@ionic/vue';
  import { pencil } from 'ionicons/icons';
  import { ref, inject, watch, onMounted, watchEffect } from 'vue';
  import { useRoute } from 'vue-router';
  import SelectProfile from '../components/SelectProfile.vue';
  import LocationDetails from '../components/LocationDetails.vue';
  import { useUser } from '@/composables/user';
  import { useProfile } from '@/composables/profile';

  const route = useRoute();
  const { user } = useUser();
  const { profile, getProfile, setProfile } = useProfile();
  const profiles = ref<Profile[]>([]);
  const location = ref<Location>(null);
  const locations = ref<Location[]>([]);
  const relationKey = ref<String>('current');
  const locationDetails = ref(null);

  const getProfiles = async () => {
    try {
      const response = await axios.get(`/api/profile`);
      if (!profile.value && response.data) {
        await setProfile(response.data[0]);
      }

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

  const handleRefresh = (e: CustomEvent) => {
    setTimeout(async () => {
      profiles.value = await fetchProfiles();
      if (profile.value) {
        locations.value = await findProfileLocations(profile.value.id);
        location.value = findCurrent();
      }
      e.target.complete();
    }, 2000);
  }

  const handleProfileSelect = async (profile: Profile) => {
    await setProfile(profile)
  }

  const fetchLocation = async (next: ProfileLocation) => {
    location.value = next.Location;
    relationKey.value = next.key;

    if (locationDetails.value) {
      locationDetails.value.scrollIntoView(
        { behavior: "smooth" }
      );
    }
  }

  watch(() => profile.value, async () => {
    if (profile.value) {
      locations.value = await findProfileLocations(profile.value.id);
      location.value = findCurrent();
    }
  });


  watch(() => route.fullPath, async () => {
    profiles.value = await getProfiles();
    if (!profile.value) setProfile(profiles.value[0]);
  });

  onMounted(async () => {
    profiles.value = await getProfiles();
    if (profile.value) {
      locations.value = await findProfileLocations(profile.value.id);
      location.value = findCurrent();
    } else setProfile(profiles.value[0]);
  });
</script>
