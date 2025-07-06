export default {
  // 获取用户
  getUserById: (state) => (id) => {
    if (!state.users.length) {
      console.log(`用户${id}不存在`);
      return false;
    }
    // console.log(state.users.find((user) => user.id === id));
    return state.users.find((user) => user.id === id) || false;
  },
  getAllUser: (state) => {
    console.log('getAllUser', state.users);
    return state.users;
  },

  // 获取群组
  getGroupById: (state) => (id) => {
    if (!state.groups.length) {
      console.log(`群组列表为空`);
      return false;
    }
    return state.groups.find((group) => group.id === id) || false;
  },
  getAllGroup: (state) => {
    return state.groups;
  },

  // 获取消息
  getGroupMessage: (state) => (id) => {
    return state.groupMsg[id];
  },
  getPrivateMessage: (state) => (id) => {
    return state.privateMsg[id];
  },

  // 获取当前用户
  getCurrentUser: (state) => {
    return state.currentUser;
  },

  // 获取当前消息列表
  getCurrentMsg: (state) => {
    return state.currentMsg;
  }
};
