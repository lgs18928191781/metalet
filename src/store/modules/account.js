export default {
  namespaced: true,
  state: () => ({
    accountList: [],
    currentAccount: null,
  }),
  mutations: {
    setAccountList(state, payload) {
      state.accountList = payload;
    },
    setCurrentAccount(state, payload) {
      state.currentAccount = payload;
      localStorage.setItem('account', payload.wif);
    },
    removeCurrentAccount(state, payload) {
      state.currentAccount = null;
      localStorage.removeItem('account');
    },
  },
  actions: {
    setAccountList(context, payload) {
      context.commit('setAccountList', payload);
    },
    setCurrentAccount(context, payload) {
      context.commit('setCurrentAccount', payload);
    },
    removeCurrentAccount(context, payload) {
      context.commit('removeCurrentAccount', payload);
    },
  },
  getters: {
    accountList: (state) => {
      return state.accountList;
    },
    currentAccount: (state) => {
      return state.currentAccount;
    },
  },
};
