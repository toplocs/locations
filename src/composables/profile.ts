import axios from 'axios';
import { ref, inject, provide, watch } from 'vue';
import { Preferences } from '@capacitor/preferences';

export function profileProvider() {
  const profile = ref<Profile | null>(null);

  const getProfile = async (profileId?: string) => {
    try {
      const id = (await Preferences.get({ key: 'profile' })).value ?? profileId;
      if (!id) throw new Error('Profile ID not found');
      const { data } = await axios.get(`/api/profile/${id}`);

      return data;
    } catch (e) {
      console.error(e);
    }
  }

  const setProfile = async (data: Profile) => {
    profile.value = data;
    await Preferences.set({ key: 'profile', value: data?.id || null });
  }

  provide('profile', {
    profile,
    getProfile,
    setProfile,
  });
}

export function useProfile() {
  const profile = inject('profile');

  if (!profile) {
    throw new Error('Composable must have an profile provider.');
  }

  return profile;
}