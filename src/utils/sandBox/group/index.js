import store from '@/store';
// 群组类
/**
 * @description: 群组类
 * @param {*} name 群名
 * @param {*} id 群号
 * @param {*} lord 群主id
 * @param {*} avatar 群头像
 */
export default class Group {
  constructor({ name, id, lord, avatar }) {
    this.id = `group-${id}`;
    this.name = name;
    this.lord = lord;
    this.avatar = avatar || `https://k.hotaru.icu/api/data/avatar/${name}`;
    this.admins = [];
    this.members = [];
    store.commit('sandBox/ADD_GROUP', this);
    store.commit('sandBox/CREATE_GROUP_MESSAGE', this);
  }

  getAllMembers() {
    return this.self().members;
  }

  addMember(user) {
    this.self().members.push(user);
  }

  removeMember(id) {
    this.members = this.members.filter((member) => member.id !== id);
  }

  self() {
    return store.getters['sandBox/getGroupById'](this.id);
  }
}
