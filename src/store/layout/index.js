export default {
  namespaced: true,
  state: {
    token: '',
    isFoldAside: false,
    host: 'serve.painchornds.top',
    port: '720',
    protocol: 'http:',
    username: 'space',
    password: '123456'
  },
  mutations: {
    updateToken(state, val = '') {
      state.token = val;
    },
    updateIsFoldAside(state, val = false) {
      state.isFoldAside = val;
    },
    updateHost(state, val = '') {
      state.host = val;
    },
    updatePort(state, val = '') {
      state.port = val;
    },
    updateProtocol(state, val = '') {
      state.protocol = val;
    },
    updateUsername(state, val = '') {
      state.username = val;
    },
    updatePassword(state, val = '') {
      state.password = val;
    }
  },
  actions: {},
  getters: {
    getIsFoldAside(state) {
      return state.isFoldAside;
    }
  }
};
