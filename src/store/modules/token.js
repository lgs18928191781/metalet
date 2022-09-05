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
      const hasOneExist = state.ftList.find((v) => {
        return v.codehash === payload.codehash && v.genesis === payload.genesis;
      });
      if (hasOneExist) {
        return;
      }
      state.ftList.push(payload);
      localStorage.setItem('ft', JSON.stringify(state.ftList));
    },
    removeFt(state, payload) {
      if (typeof payload !== 'number') {
        const targetIndex = state.ftList.findIndex((v) => {
          return v.codehash === payload || v.genesis === payload;
        });
        if (targetIndex > -1) {
          payload = targetIndex;
        }
      }
      state.ftList.splice(payload, 1);
      localStorage.setItem('ft', JSON.stringify(state.ftList));
    },
    setNftList(state, payload) {
      state.nftList = payload;
      localStorage.setItem('nft', JSON.stringify(payload));
    },
    addNft(state, payload) {
      const hasOneExist = state.nftList.find((v) => {
        return v.codehash === payload.codehash && v.genesis === payload.genesis;
      });
      if (hasOneExist) {
        return;
      }
      state.nftList.push(payload);
      localStorage.setItem('nft', JSON.stringify(state.nftList));
    },
    removeNft(state, payload) {
      if (typeof payload !== 'number') {
        const targetIndex = state.nftList.findIndex((v) => {
          return v.codehash === payload || v.genesis === payload;
        });
        if (targetIndex > -1) {
          payload = targetIndex;
        }
      }
      state.nftList.splice(payload, 1);
      localStorage.setItem('nft', JSON.stringify(state.nftList));
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
