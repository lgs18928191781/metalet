import { getStorageSession, setStorageSession } from '@/util';

const cacheUser = getStorageSession();

export default {
  namespaced: true,
  state: () => ({
    ...cacheUser,
  }),
  mutations: {
    setUser(state, payload) {
      if (!payload) {
        for (let key in state) {
          delete state[key];
        }
        state = {};
      } else {
        state = Object.assign(state, payload);
      }
      setStorageSession(payload);
    },
  },
  actions: {
    setUser(context, payload) {
      context.commit('setUser', payload);
    },
  },
  getters: {
    user: (state) => {
      return state;
    },
  },
};
