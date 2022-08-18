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
    },
  },
  actions: {
    setAccountList(context, payload) {
      context.commit('setAccountList', payload);
    },
    setCurrentAccount(context, payload) {
      context.commit('setCurrentAccount', payload);
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
