<template>
  <ion-item>
    <ion-avatar slot="start">
      <img :src="profile?.image" />
    </ion-avatar>

    <ion-label>
      <ion-select
        aria-label="Select your profile"
        placeholder="Select your profile"
        interface="action-sheet"
        justify="start"
        :value="selectedId"
        v-model="selectedId"
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
  import { ref, watch, onMounted } from 'vue';
  import { Profile } from '../toplocs';
  import { useProfile } from '@/composables/profile';

  const props = defineProps<{
    profiles: Profile[];
  }>();
  const emit = defineEmits(['selectProfile']);
  const { profile, setProfile } = useProfile();
  const selectedId = ref(null);

  watch(() => profile.value, () => {
    selectedId.value = profile.value?.id;
  });

  watch(() => selectedId.value, () => {
    if (props.profiles) {
      const selected = props.profiles.find(
        x => x.id == selectedId.value
      );
      setProfile(selected);
    }
  });

  onMounted(() => {
    selectedId.value = profile.value?.id
  });
</script>