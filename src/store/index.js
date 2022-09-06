import { createStore } from 'vuex';
import system from './modules/system';
import account from './modules/account';
import token from './modules/token';

const store = createStore({
  modules: {
    system,
    account,
    token,
  },
});

export default store;
