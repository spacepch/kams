import mutations from './mutations';
import getters from './getters';
import actions from './actions';
const superAdmin = {
  id: 'user-super-admin',
  name: '超级管理员',
  avatar: 'https://k.hotaru.icu/api/data/avatar/super',
  isSuper: true,
  friends: [],
  groups: [],
  numId: 'super-admin',
  sex: 'bot',
  age: '100'
};
export default {
  namespaced: true,
  state: {
    registeredUsersCount: 0,
    users: [superAdmin],
    currentUser: null,
    currentMsg: null,
    groups: [],
    privateMsg: {
      [superAdmin.id]: {}
    },
    groupMsg: {},
    wsInstance: null,
    wsStatus: 'disconnected'
  },
  mutations,
  getters,
  actions
};
