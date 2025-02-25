import axios from 'axios';
import { Preferences } from '@capacitor/preferences';

export let session = null;

export const reloadSession = async () => {
  try {
    const token = await Preferences.get({ key: 'token' });
    if (token) {
      const response = await axios.get(`/api/auth`, {
        headers: {
          'Authorization': JSON.stringify({
            token: token.value
          }),
          'Content-Type': 'application/json'
        }
      });
      if (!response.data) throw new Error('No valid session!');
      session = response.data.session;

      return session;
    }
  } catch (e) {
    console.error(e);
  }
}