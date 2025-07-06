import mutations from './mutations';
import getters from './getters';
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
    users: [superAdmin],
    currentUser: {},
    currentMsg: null,
    groups: [],
    privateMsg: {
      [superAdmin.id]: {}
    },
    groupMsg: {}
  },
  mutations,
  getters
};
