<template>
  <div class="ion-padding">
    <ion-breadcrumbs>
      <ion-breadcrumb
        v-for="parent of locationParents"
        @click="() => {}"
      > {{ parent.title }}
      </ion-breadcrumb>
    </ion-breadcrumbs>
    
    <ion-grid>
      <ion-row class="ion-padding-bottom">
        <h3>{{ location.title }}</h3>
        <ion-chip color="success">
          {{ status }}
        </ion-chip>
      </ion-row>

      <div v-if="current?.length">
        <ion-item-divider>
          <ion-label>Currently here:</ion-label>
        </ion-item-divider>
        <ion-row>
          <ion-col v-for="x of current" size="auto">
            <ion-avatar>
              <img :src="x.Profile?.image" />
            </ion-avatar>
            <ion-label style="text-align: center;">
              {{ x.Profile.username }}
            </ion-label>
          </ion-col>
        </ion-row>
      </div>


      <div v-if="favorite?.length">
        <ion-item-divider>
          <ion-label>Liked by:</ion-label>
        </ion-item-divider>
        <ion-row>
          <ion-col v-for="x of favorite" size="auto">
            <ion-avatar>
              <img :src="x.Profile?.image" />
            </ion-avatar>
            <ion-label style="text-align: center;">
              {{ x.Profile.username }}
            </ion-label>
          </ion-col>
        </ion-row>
      </div>

      <div v-if="past?.length">
        <ion-item-divider>
          <ion-label>Was here:</ion-label>
        </ion-item-divider>
        <ion-row>
          <ion-col v-for="x of past" size="auto">
            <ion-avatar>
              <img :src="x.Profile?.image" />
            </ion-avatar>
            <ion-label style="text-align: center;">
              {{ x.Profile.username }}
            </ion-label>
          </ion-col>
        </ion-row>
      </div>

    </ion-grid>
  </div>
</template>

<script setup lang="ts">
  import axios from 'axios';
  import { ref, computed, watchEffect } from 'vue';
  import {
    IonAvatar,
    IonCol,
    IonGrid,
    IonRow,
    IonLabel,
    IonTitle,
    IonChip,
    IonIcon,
    IonItemDivider,
    IonBreadcrumb,
    IonBreadcrumbs
  } from '@ionic/vue';
  
  const props = defineProps<{
    location: Location;
    //locationData: ProfileLocation[];
    status: string;
  }>();
  const locationProfiles = ref<ProfileLocation>([]);
  const locationParents = ref<Location>([]);
  const current = computed(() => (
    locationProfiles.value?.filter(x => x.key == 'current')
  ));
  const favorite = computed(() => (
    locationProfiles.value?.filter(x => x.key == 'favorite')
  ));
  const past = computed(() => (
    locationProfiles.value?.filter(x => x.key == 'past')
  ));

  const findLocationProfiles = async (id: string) => {
    try {
      const response = await axios.get(`/api/v2/location/profiles/${id}`);

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  const traveseLocationParents = async (id: string) => {
    try {
      const parents = [];
      let currentId = id;
      for (let i = 0; i < 3; i++) {
        const response = await axios.get(`/api/v2/location/locations/${currentId}?key=childOf`);
        if (!response.data[0]) break;
        parents.push(response.data[0].OtherLocation);
        currentId = response.data[0].otherLocationId;
      }

      return parents.reverse();
    } catch (error) {
      console.error(error);
    }
  }
 
  watchEffect(async () => {
    locationProfiles.value = await findLocationProfiles(props.location.id);
    locationParents.value = await traveseLocationParents(props.location.id);
  });
</script>