import Group from '../group';
import store from '@/store';
import { nanoid } from 'nanoid';

const ROLE_SELF = 'self';
const ROLE_FRIEND = 'friend';
console.error('user: 删除群聊方法待完善！');
// 用户类
/**
 * @description: 用户类
 * @param {*} param0 { numId：用户id, name：用户名, age：年龄, sex：性别, avatar：头像 }
 */
export default class User {
  constructor({ numId, name, age, sex, avatar, id }) {
    this.name = name;
    this.id = id || `user-${numId}`;
    this.numId = numId;
    this.age = age;
    this.sex = sex;
    this.avatar = avatar || `https://picsum.photos/id/${name}/200/200`;
    this.groups = [];
    this.friends = [];
  }

  /**
   * 挂载用户
   * @returns 是否挂载成功
   */
  mount() {
    const hasUser = store.getters['sandBox/getUserById'](this.id);
    if (hasUser) return false;
    store.commit('sandBox/ADD_USER', this);
    store.commit('sandBox/CREATE_PRIVATE_MESSAGE', this.id);
    this.addFriend('user-super-admin');
    return this;
  }

  /**
   * 获取好友列表
   * @returns 对象数组
   */
  getAllFriend() {
    return this.self().friends;
  }

  /**
   * 获取群组列表
   * @returns 群组列表
   */
  getAllGroups() {
    const g_list = this.self().groups.map(({ id }) => id);
    const all_groups = g_list.map((gid) => {
      return store.getters['sandBox/getGroupById'](gid);
    });
    return all_groups;
  }

  /**
   * 通过群组id获取群组信息
   * @param {*} id 群组id
   * @returns 群组信息
   */
  getGroupById(groupId) {
    const hasGroup = this.self().groups.some(({ id }) => id === groupId);
    return hasGroup && store.getters['sandBox/getGroupById'](groupId);
  }

  /**
   * 添加好友
   * @param {*} fid 好友id
   */
  addFriend(fid) {
    const friend = store.getters['sandBox/getUserById'](fid);
    const hasFriend = this.self().friends?.some((friendItem) => friendItem.id === fid);
    if (!friend || hasFriend || fid === this.id) return false;
    store.commit('sandBox/ADD_FRIEND', { fid, id: this.id });
    store.commit('sandBox/INIT_PRIVATE_MESSAGE', { id: this.id, fid });
    this.receiveAddFriend(friend);
    return true;
  }

  receiveAddFriend(friend) {
    store.commit('sandBox/ADD_FRIEND', { fid: this.id, id: friend.id });
    const frdMsg = store.getters['sandBox/getPrivateMessage'](friend.id);
    if (!Reflect.has(frdMsg, this.id)) {
      store.commit('sandBox/INIT_PRIVATE_MESSAGE', { id: friend.id, fid: this.id });
      console.log(`${this.self().name}已添加到${friend.name}的好友列表中`);
    }
  }

  /**
   * 删除好友
   * @param {*} friendId 好友id
   */
  removeFriendById(fid) {
    const friend = store.getters['sandBox/getUserById'](fid);
    const self = store.getters['sandBox/getUserById'](this.id);
    const hasFriend = self.friends.some((friendItem) => friendItem.id === fid);
    if (!hasFriend) return false;
    this.deleteFriendMessage(fid);
    self.friends = self.friends.filter((friendItem) => friendItem.id !== fid);
    this.receiveRemoveFriend(self, friend);
    return true;
  }

  receiveRemoveFriend(self, friend) {
    friend.friends = friend.friends.filter((friendHandle) => {
      return friendHandle.id !== self.id;
    });
    console.log(`${self.name}已从${friend.name}的好友列表中移除`);
  }

  /**
   * 创建群组
   * @param {*} { id: 群组id, name: 群组名称, members: 邀请成员列表, avatar: 群组头像 }
   * @returns 群组对象
   */
  createGroup({ id, name, members, avatar }) {
    if (!id && !name) return false;
    const gid = `group-${id}`;
    const normalizeMembers = this._memberNormalize(members);
    const hasGroup = this.getGroupById(gid);
    if (hasGroup) return false;
    const group = new Group({ name, numId: id, lord: this.id, avatar }).mount();
    normalizeMembers.forEach(async (member) => {
      const mid = member.id;
      const hasUser = this.getUserById(mid);
      if (!hasUser) return console.log(`用户${mid}不存在`);
      const role = mid === this.id ? 'lord' : 'member';
      group.addMember({ uid: member.id, role });
    });
    group.addMember({ uid: this.id, role: 'lord' });
    group.addMember({ uid: 'user-super-admin', role: 'super-admin' });
    return group;
  }

  /**
   * 删除群组
   * @param {*} gid 群组id
   */
  removeGroupById(gid) {
    const group = store.getters['sandBox/getGroupById'](gid);
    const members = group.members;
    const isLord = group.lord === this.id;
    if (!isLord) return false;
    members.forEach((member) => {
      const user = store.getters['sandBox/getUserById'](member.id);
      user.groups = user.groups.filter((group) => group.id !== gid);
    });
    store.commit('sandBox/DEL_GROUP_MESSAGE', { gid });
    store.commit('sandBox/REMOVE_GROUP', gid);
    return true;
  }

  /**
   * 加入群组
   * @param {*} gid 群组id
   */
  addGroupById(gid) {
    const groupData = store.getters['sandBox/getGroupById'](gid);
    if (!groupData) return false;
    const group = new Group(groupData);
    const hasMember = group.getAllMember().some((member) => member.id === this.id);
    if (hasMember) return false;
    group.addMember({ uid: this.id, role: 'member' });
    return true;
  }

  /**
   * 邀请用户加入群组
   * @param {*} param0 { groupId：群组id, invitee：被邀请人id, role：角色 }
   */
  inviteUserToGroup({ groupId, invitee, role = 'member' }) {
    const group = store.getters['sandBox/getGroupById'](groupId);
    const normalizeInvitee = this._memberNormalize(invitee);
    const hasSelf = group.members.some((m) => m.id === this.id);
    if (!group || !hasSelf) return false;
    const isLord = group.lord === this.id;
    const roleHandle = isLord ? role : 'member';
    normalizeInvitee.forEach((invitee) => {
      const hasMember = group.members.some((m) => m.id === invitee.id);
      if (hasMember) return false;
      if (roleHandle === 'admin') group.admins.push(invitee.id);
      group.members.push({ id: invitee.id, role: roleHandle });
      invitee.groups.push({ id: groupId, role: roleHandle });
    });
    return true;
  }

  /**
   * 离开群组
   * @param {*} gid 群组id
   */
  leaveGroupById(gid) {
    const group = store.getters['sandBox/getGroupById'](gid);
    if (!group) return false;
    this.self().groups = this.self().groups.filter((group) => group.id !== gid);
    group.members = group.members.filter((member) => member.id !== this.id);
    return true;
  }

  /**
   * 踢出群成员
   * @param {*} param0 { groupId：群组id, expellee：被踢人id }
   */
  kickMemberById({ groupId, expellee }) {
    const group = store.getters['sandBox/getGroupById'](groupId);
    const exp = store.getters['sandBox/getUserById'](expellee);
    if (!group || !exp || expellee === this.id) return false;
    if (!this._isAdmin(groupId)) return false;
    if (group.admins.some((ad) => ad === expellee) || group.lord === expellee) return false;
    // const isLord = group.lord === this.id;
    // if (!isLord) return false;
    exp.groups = exp.groups.filter((g) => g.id !== groupId);
    group.members = group.members.filter((member) => member.id !== exp.id);
    return true;
  }

  // 操作信息

  /**
   * 发送私聊消息
   * @param {*} param0 { id：好友id, content：消息内容 }
   */
  sendMessageToFriend({ id, content }) {
    if (!this.self().friends.some((friend) => friend.id === id)) return false;
    const msgId = nanoid();
    const timestamp = Date.now();
    const message = { id: msgId, role: ROLE_SELF, receiver: id, content, date: timestamp };
    const msgOption = { sender: this.id, receiver: id, message };
    store.commit('sandBox/SEND_PRIVATE_MESSAGE', msgOption);
    this.receiveFriendMessage({ id, content, msgId, timestamp });
    return true;
  }

  /**
   * 接收私聊消息
   * @param {*} param0 {id, content, msgId, timestamp}
   */
  receiveFriendMessage({ id, content, msgId, timestamp }) {
    const message = { id: msgId, role: ROLE_FRIEND, content, date: timestamp, sender: this.id };
    const msgOption = { sender: id, receiver: this.id, message };
    store.commit('sandBox/SEND_PRIVATE_MESSAGE', msgOption);
  }

  /**
   * 删除私聊消息
   * @param {*} fid 好友id
   * @param {*} msgId 消息id
   */
  deleteFriendMessage(fid, msgId) {
    if (!this.self().friends.some((friend) => friend.id === fid)) return false;
    store.commit('sandBox/DEL_PRIVATE_MESSAGE', { sender: fid, receiver: this.id, msgId });
    store.commit('sandBox/DEL_PRIVATE_MESSAGE', { sender: this.id, receiver: fid, msgId });
    return true;
  }

  /**
   * 发送群聊消息
   * @param {*} param0 { id：群组id, content：消息内容 }
   */
  sendMessageToGroup({ id, content, replyMsg = null }) {
    const group = store.getters['sandBox/getGroupById'](id);
    if (!group) return false;
    const hasMember = group.members.some((member) => member.id === this.id);
    if (!hasMember) return false;
    const groupMsg = store.getters['sandBox/getGroupMessage'](id);
    const hasMute = groupMsg.isMute || groupMsg.muteMembers.includes(this.id);
    if (!this._isAdmin(id) && hasMute) return false;
    const message = {
      id: nanoid(),
      role: this.id,
      isGroup: true,
      content,
      date: new Date(),
      replyMsg
    };
    store.commit('sandBox/SEND_GROUP_MESSAGE', { gid: id, message });
    return true;
  }

  /**
   * 删除群聊消息
   * @param {*} param0 { id：群组id, msgId：消息id }
   */
  deleteGroupMessage({ id, msgId }) {
    const group = store.getters['sandBox/getGroupById'](id);
    if (!group) return false;
    const hasMember = group.members.some((member) => member.id === this.id);
    if (!hasMember) return false;
    const groupMsg = store.getters['sandBox/getGroupMessage'](id);
    const hasMessage = groupMsg.messages.some((message) => message.id === msgId);
    if (!hasMessage) return false;
    const isMyMessage = groupMsg.messages.find((message) => message.id === msgId).role === this.id;
    if (!this._isAdmin(id) && !isMyMessage) return false;
    store.commit('sandBox/DEL_GROUP_MESSAGE', { id, msgId });
    return true;
  }

  /**
   * 群组禁言
   * @param {*} gid 群组id
   * @param {*} isMute 是否禁言
   */
  handleMuteGroupById(gid, isMute) {
    if (!this._isAdmin(gid)) return false;
    store.commit('sandBox/HANDLE_MUTE_GROUP', { gid, isMute });
    return true;
  }

  /**
   * 群成员禁言
   * @param {*} gid 群组id
   * @param {*} mid 成员id
   */
  muteMemberById(gid, mid) {
    if (!this._isAdmin(gid)) return false;
    store.commit('sandBox/MUTE_MEMBER', { gid, mid });
    return true;
  }

  /**
   * 群成员取消禁言
   * @param {*} gid 群组id
   * @param {*} mid 成员id
   */
  unmuteMemberById(gid, mid) {
    if (!this._isAdmin(gid)) return false;
    store.commit('sandBox/UNMUTE_MEMBER', { gid, mid });
    return true;
  }

  /**
   * 设置群管理员
   * @param {*} param0 { gid：群组id, mid：成员id }
   */
  setGroupAdmin({ gid, mid }) {
    if (!this._isAdmin(gid)) return false;
    if (this.self().groups.role === 'lord') return false;
    const group = this.getGroupById(gid);
    if (!group.members.some(({ id }) => id === mid)) return false;
    if (group.lord === mid) return false;
    if (group.admins.some((id) => id === mid)) return false;
    store.commit('sandBox/SET_GROUP_ADMIN', { gid, mid });
    return true;
  }

  /**
   * 获取好友消息
   * @param {*} friendId 好友id
   */
  getFriendMessageById(friendId) {
    const allMsg = store.getters['sandBox/getPrivateMessage'](this.id);
    const friendMsg = allMsg[friendId] || [];
    return friendMsg;
  }

  /**
   * 获取群消息
   */
  getGroupMessageById(groupId) {
    return store.getters['sandBox/getGroupMessage'](groupId);
  }

  // 私有方法
  /**
   * @description: 将传入的成员参数进行规范化
   * @param {Array} members
   * @return {Array}
   */
  _memberNormalize(members) {
    let memberHandle;
    if (members instanceof Array) {
      return members
        .map((member) => {
          if (member instanceof Object) {
            return member;
          } else {
            memberHandle = store.getters['sandBox/getUserById'](member);
            return memberHandle;
          }
        })
        .filter((member) => member); // 过滤掉不存在的用户
    } else if (members instanceof Object) {
      return [members];
    } else {
      memberHandle = store.getters['sandBox/getUserById'](members);
      return memberHandle && typeof memberHandle === 'object' ? [memberHandle] : []; // 检测members是否为有效对象
    }
  }

  /**
   * @description: 获取当前用户
   * @return {Object}
   */
  self() {
    return store.getters['sandBox/getUserById'](this.id);
  }

  /**
   * @description: 判断当前用户是否为管理员
   * @param {String} gid
   * @return {Boolean}
   */
  _isAdmin(gid) {
    const group = store.getters['sandBox/getGroupById'](gid);
    const id = this.self().id;
    const isAdmin =
      group.admins.some((ad) => ad === id) || group.lord === id || this.self().isSuper;
    return isAdmin;
  }
}
