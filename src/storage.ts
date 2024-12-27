import axios from 'axios';
import { Storage } from "@ionic/storage";

export default {
  install: async (app) => {
    const storage = new Storage();
    await storage.create();

    const authHeader = await storage.get('authHeader');
    axios.defaults.headers.common['Authorization'] = authHeader;
  },
};