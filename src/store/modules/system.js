import config from '@/config';
import { getNavigatorLanguage, getStorageLanguage, setStorageLanguage } from '@/util';

export default {
  namespaced: true,
  state: () => ({
    config,
    locale: getStorageLanguage() || getNavigatorLanguage(),
  }),
  mutations: {
    setConfig(state, payload) {
      state.config = Object.assign(state.config, payload);
    },
    setLocale(state, payload) {
      state.locale = payload;
      setStorageLanguage(payload);
    },
  },
  actions: {
    setConfig(context, payload) {
      context.commit('setConfig', payload);
    },
    setLocale(context, payload) {
      context.commit('setLocale', payload);
    },
  },
  getters: {
    config: (state) => {
      return state.config;
    },
    locale: (state) => {
      return state.locale;
    },
  },
};
