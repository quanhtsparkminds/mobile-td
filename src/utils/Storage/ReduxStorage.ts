import { Storage } from "redux-persist";
import { storage, secureStorage } from "./Storage";

export const reduxStorage: Storage = {
  setItem: (key, value) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key) => {
    storage.delete(key);
    return Promise.resolve();
  },
};

export const reduxSecureStorage: Storage = {
  setItem: async (key, value) => {
    await secureStorage.setItem(key, value);
    return Promise.resolve(true);
  },
  getItem: async (key) => {
    const value = await secureStorage.getItem(key);
    return Promise.resolve(value);
  },
  removeItem: async (key) => {
    await secureStorage.removeItem(key);
    return Promise.resolve();
  },
};
