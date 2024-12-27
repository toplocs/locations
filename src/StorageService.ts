import { Storage } from "@ionic/storage";

const storage = new Storage();
await storage.create();

export default storage;