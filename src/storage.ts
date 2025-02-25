import axios from 'axios';
import { Storage } from '@ionic/storage';
import { Preferences } from '@capacitor/preferences';

export default {
  install: async (): Promise<void> => {
    const storage = new Storage();
    await storage.create();

    //const authHeader = await storage.get('authHeader');
    const token = await Preferences.get({ key: 'token' });
    axios.defaults.headers.common['Authorization'] = JSON.stringify({
      token: token.value
    });
  },
};