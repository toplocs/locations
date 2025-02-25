import axios from 'axios';
import { ref, inject, provide, readonly } from 'vue';
import { App } from '@capacitor/app'
import { Preferences } from '@capacitor/preferences';

export function userProvider() {
  const user = ref<User | null>(null);
  const isAuthenticated = readonly(user.value !== null);

  const getUser = async (userId: string) => {
    try {
      const { data } = await axios.get(`/api/user/byId/${userId}`);
   
      console.log('user', data);
      return data;
    } catch (e) {
      console.error(e);
    }
  }

  const login = async (formData: {
    email: string, password: string
  }) => {
    const { data } = await axios.post(`/api/auth/login`, formData);
    if (data) {
      await Preferences.set({ key: 'token', value: data.token });
      axios.defaults.headers.common['Authorization'] = JSON.stringify({
        token: data.token
      });
    }
    
    return data;
  }

  const logout = async () => {
    await Preferences.remove({ key: 'token' });
    axios.defaults.headers.common['Authorization'] = null;
    user.value = null;
  }

  provide('user', {
    user,
    isAuthenticated,
    getUser,
    login,
    logout
  });
}

export function useUser() {
  const user = inject('user');

  if (!user) {
    throw new Error('Composable must have an user provider.');
  }

  return user;
}