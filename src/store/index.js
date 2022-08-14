import { createStore } from 'vuex';
import system from './modules/system';
import user from './modules/user';

const store = createStore({
  modules: {
    system,
    user,
  },
});

export default store;
