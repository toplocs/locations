<template>
  <ion-card>
    <ion-card-header>
      <ion-breadcrumbs>
        <ion-breadcrumb>Europe</ion-breadcrumb>
        <ion-breadcrumb>Germany</ion-breadcrumb>
        <ion-breadcrumb>Saarland</ion-breadcrumb>
        <ion-breadcrumb>Merzig (City)</ion-breadcrumb>
      </ion-breadcrumbs>

      <ion-card-title>
        {{ location.title }} (Café)
        <ion-chip color="success">
          {{ status }}
        </ion-chip>
      </ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <ion-grid>
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
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import {
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonAvatar,
    IonCol,
    IonGrid,
    IonRow,
    IonLabel,
    IonChip,
    IonIcon,
    IonItemDivider,
    IonBreadcrumb,
    IonBreadcrumbs
  } from '@ionic/vue';
  
  const props = defineProps<{
    location: Location;
    locationData: ProfileLocation[];
    status: string;
  }>();
  const current = computed(() => (
    props.locationData?.filter(x => x.key == 'current')
  ));
  const favorite = computed(() => (
    props.locationData?.filter(x => x.key == 'favorite')
  ));
  const past = computed(() => (
    props.locationData?.filter(x => x.key == 'past')
  ));

</script>