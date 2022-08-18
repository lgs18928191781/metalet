import { createStore } from 'vuex';
import system from './modules/system';
import account from './modules/account';

const store = createStore({
  modules: {
    system,
    account,
  },
});

export default store;
