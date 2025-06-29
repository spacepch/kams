import mutations from './mutations';
import getters from './getters';
export default {
  namespaced: true,
  state: {
    users: [],
    currentUser: {},
    currentMsg: null,
    groups: [],
    privateMsg: {},
    groupMsg: {}
  },
  mutations,
  getters
};
