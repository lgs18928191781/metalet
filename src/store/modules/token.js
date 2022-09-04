const ftListStr = localStorage.getItem('ft') || '[]';
const nftListStr = localStorage.getItem('nft') || '[]';
let ftList = [];
let nftList = [];
try {
  ftList = JSON.parse(ftListStr);
  nftList = JSON.parse(nftListStr);
} catch (err) {}

export default {
  namespaced: true,
  state: () => ({
    ftList,
    nftList,
  }),
  mutations: {
    setFtList(state, payload) {
      state.ftList = payload;
      localStorage.setItem('ft', JSON.stringify(payload));
    },
    addFt(state, payload) {
      state.ftList.push(payload);
    },
    removeFt(state, payload) {
      state.ftList.splice(payload, 1);
    },
    setNftList(state, payload) {
      state.nftList = payload;
      localStorage.setItem('nft', JSON.stringify(payload));
    },
    addNft(state, payload) {
      state.nftList.push(payload);
    },
    removeNft(state, payload) {
      state.nftList.splice(payload, 1);
    },
  },
  actions: {
    setFtList(context, payload) {
      context.commit('setAccountList', payload);
    },
    addFt(context, payload) {
      context.commit('addFt', payload);
    },
    removeFt(context, payload) {
      context.commit('removeFt', payload);
    },
    setNftList(context, payload) {
      context.commit('setCurrentAccount', payload);
    },
    addNft(context, payload) {
      context.commit('addNft', payload);
    },
    removeNft(context, payload) {
      context.commit('removeNft', payload);
    },
  },
  getters: {
    ftList: (state) => {
      return state.ftList;
    },
    nftList: (state) => {
      return state.nftList;
    },
  },
};
