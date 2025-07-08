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
  constructor({ name, numId, id, lord, avatar }) {
    this.id = id || `group-${numId}`;
    this.numId = numId;
    this.name = name;
    this.lord = lord;
    this.avatar = avatar || `https://k.hotaru.icu/api/data/avatar/${name}`;
    this.admins = [];
    this.members = [];
  }

  mount() {
    store.commit('sandBox/ADD_GROUP', this);
    store.commit('sandBox/CREATE_GROUP_MESSAGE', this);
    return this;
  }

  getAllMember() {
    return this.self().members.map((member) => {
      const user = store.getters['sandBox/getUserById'](member.id);
      const { id, avatar, name, sex, age, numId } = user;
      return { role: member.role, id, avatar, name, sex, age, numId };
    });
  }

  getMemberById(id) {
    return this.getAllMember().find((member) => member.id === id);
  }

  addMember({ uid, role }) {
    store.commit('sandBox/ADD_MEMBER', { gid: this.id, uid, role });
  }

  removeMember(id) {
    this.members = this.members.filter((member) => member.id !== id);
  }

  self() {
    return store.getters['sandBox/getGroupById'](this.id);
  }
}
