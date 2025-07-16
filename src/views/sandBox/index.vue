<template>
  <k-container class="k-container k-sb-main" v-resize-ob:300="screenResize" direction="horizontal">
    <!-- 好友、群聊列表 -->
    <sb-left-aside
      ref="leftAsideRef"
      :screen="screen"
      :updateChatTarget="updateChatTargetFn"
      @switchMsg="switchMsgCallback"
    ></sb-left-aside>
    <k-container v-show="show.isShowChatBox" direction="vertical" style="width: 100%">
      <!-- 聊天窗口页头 -->
      <header class="k-chat-header" v-show="show.isShowChatBox">
        <gray-button class="icon-btn" v-show="1">
          <pps-icon icon="pps-icon-side-show"></pps-icon>
        </gray-button>
        <div class="k-chat-header-content">
          <h1 class="k-chat-header-title">{{ chatTarget.id }}</h1>
        </div>
      </header>
      <k-container direction="horizontal" class="k-chat-main">
        <sb-chat-main
          ref="chatMainRef"
          @showUserDetail="showUserDetailFn"
          :chatTarget="chatTarget"
          :memberList="getMemberList"
          @handleMenuAction="handleMenuAction"
        ></sb-chat-main>
        <!-- 右侧、群聊成员 -->
        <sb-right-aside
          v-if="chatTarget.isGroup && getMemberList.length"
          :chatTarget="chatTarget"
          :memberList="getMemberList"
          @handleMenuAction="handleMenuAction"
        ></sb-right-aside>
      </k-container>
    </k-container>
  </k-container>
</template>

<script>
import { mapGetters } from 'vuex';
import User from '@/utils/sandBox/user';
import Administrators from '@/utils/sandBox/administrators';
import Group from '@/utils/sandBox/group';
import kContainer from '@/components/layout/container';
import sbLeftAside from './aside/left.vue';
import sbRightAside from './aside/right.vue';
import sbChatMain from './main/chat.vue';
import grayButton from './ui/grayButton.vue';
export default {
  name: 'sandBox',
  components: { kContainer, sbLeftAside, sbRightAside, sbChatMain, grayButton },
  data() {
    return {
      show: {
        isShowUsers: true,
        isShowGroups: true,
        isShowChatBox: true
      },
      screen: { width: 0, height: 0 },
      admin: new Administrators(),
      chatTarget: {
        id: '',
        isGroup: false
      }
    };
  },
  methods: {
    test() {
      const admin = new Administrators();
      // this.$store.commit('sandBox/CLEAR_USERS'); // 清空用户
      // this.$store.commit('sandBox/CLEAR_GROUPS'); // 清空群组
      const jack = admin.createUser({ id: 1, name: 'jack', age: 18, sex: '男' });
      const tom = admin.createUser({ id: 2, name: 'tom', age: 28, sex: '男' });
      const lucy = admin.createUser({ id: 3, name: 'lucy', age: 17, sex: '女' });
      const mary = new User({ id: 4, name: 'mary', age: 19, sex: '女' });
      const someone = new User({ id: '21022102cz', name: '只陌予', age: 22, sex: '女' });
      admin.createGroup({
        id: 11,
        name: 'group1',
        members: ['user-1', 'user-2', 'user-3', 'user-4'],
        lord: 'user-1'
      });
      admin.createGroup({ id: 22, name: 'group2', members: ['user-3', jack, tom], lord: 'user-2' });
      admin.createGroup({
        id: 33,
        name: 'group3',
        members: ['user-1', 'user-2', lucy, someone],
        lord: 'user-3'
      });
      if (mary.addFriend('user-2')) console.log('mary添加tom成功');
      if (jack.addFriend('user-3')) console.log('jack添加tom成功');
      mary.addFriend('user-1');
      tom.addFriend('user-1');
      // lucy.removeGroupById(33);
      // jack.addGroupById({ groupId: 33 });
      // lucy.leaveGroupById(22);
      // console.log(admin.getAllUser());
      // lucy.kickMemberById({ groupId: 11, expellee: 1 });
      // mary.leaveGroupById(22);
      jack.sendMessageToFriend({ id: 'user-2', content: '你好' });
      jack.sendMessageToFriend({ id: 'user-3', content: '你好' });
      jack.sendMessageToFriend({ id: 'user-4', content: '你好' });
      // admin.removeUserById('user-1');
      // lucy.sendMessageToFriend({ id: 1, content: 'hi' });
      // jack.removeFriendById(3);
      lucy.inviteUserToGroup({ groupId: 'group-33', invitee: 'user-4', role: 'admin' });
      // lucy.deleteGroupMessage({ id: 33, msgId: 'DoRpJ4CDs2LiZlWZVylFG' });
      // mary.unmuteMemberById(33, 2);
      // mary.handleMuteGroupById(33, false)
      // tom.sendMessageToGroup({ id: 'group-33', content: '大家好！我是tom' });
      // jack.sendMessageToGroup({ id: 'group-33', content: '大家好！我是jack' });
      // mary.sendMessageToGroup({ id: 'group-33', content: '大家好！我是mary' });
      // admin.removeGroupById('group-33');
      // console.log(this.$store.getters['sandBox/getCurrentUser']);
      // this.$store.commit('sandBox/SWITCH_USER', 'user-4')
    },
    createUser({ id, name, age, sex }) {
      // eslint-disable-next-line no-new
      new User({ id, name, age, sex });
    },
    screenResize(x, y) {
      const width = Math.floor(x);
      const height = Math.floor(y);
      this.screen.width = width;
      this.screen.height = height;
    },
    updateChatTargetFn(id, isGroup) {
      // console.log('chage', id, isGroup);
      this.chatTarget.id = id;
      this.chatTarget.isGroup = isGroup;
    },
    switchMsgCallback(params) {
      // console.log(params);
    },
    showUserDetailFn(userInfo) {},
    handleMenuAction(action) {
      const { actionType, currentUer, targetUser, groupId } = action;
      const actionMap = {
        VIEW_PROFILE: this.viewUserProfile,
        ADD_FRIEND: this.addFriend,
        REMOVE_FRIEND: this.removeFriend,
        AT_USER: this.mentionUser,
        REMOVE_USER: this.kickMember,
        MUTE_USER: this.muteMember,
        UNMUTE_USER: this.unmuteMember,
        REVOKE_ADMIN: this.revokeAdmin,
        SET_ADMIN: this.setAdmin
      };
      if (actionMap[actionType]) {
        actionMap[actionType](targetUser, groupId, currentUer);
      }
    },
    viewUserProfile(targetUser, groupId, currentUer) {
      this.$refs.leftAsideRef.showUserDetailFn(targetUser);
    },
    mentionUser(targetUser, groupId, currentUer) {
      this.$refs.chatMainRef.mentionMember(targetUser.name);
    },
    addFriend(targetUser, groupId, currentUer) {
      console.log('addFriend');
      const user = new User(this.getCurrentUser);
      const res = user.addFriend(targetUser.id);
      if (res) this.$message.success('添加成功！');
      else this.$message.error('添加失败！');
    },
    removeFriend(targetUser, groupId, currentUer) {
      console.log('removeFriend');
      const user = new User(this.getCurrentUser);
      user.removeFriendById(targetUser.id);
    },
    muteMember(targetUser, groupId, currentUer) {
      console.log('muteMember', groupId, targetUser);
      const user = new User(this.getCurrentUser);
      user.muteMemberById(groupId, targetUser.id);
    },
    unmuteMember(targetUser, groupId, currentUer) {
      const user = new User(this.getCurrentUser);
      const res = user.unmuteMemberById(groupId, targetUser.id);
      if (res) {
        console.log('unmuteMember success');
      } else {
        console.log('unmuteMember fail');
      }
    },
    kickMember(targetUser, groupId, currentUer) {
      console.log('kickMember');
      const user = new User(this.getCurrentUser);
      const res = user.kickMemberById({ groupId, expellee: targetUser.id });
      if (res) {
        console.log('kickMember success');
      } else {
        console.log('kickMember fail');
      }
    },
    setAdmin(targetUser, groupId, currentUer) {
      console.log('setAdmin');
      const res = new User(this.getCurrentUser).setGroupAdmin({
        gid: groupId,
        mid: targetUser.id
      });
      console.log(res);
    },
    revokeAdmin(targetUser, groupId, currentUer) {
      console.log('revokeAdmin');
      const res = new User(this.getCurrentUser).revokeGroupAdmin(groupId, targetUser.id);
      console.log(res);
    }
  },
  computed: {
    ...mapGetters('sandBox', ['getCurrentUser', 'getCurrentMsg']),
    getMemberList() {
      if (this.chatTarget.isGroup && this.getCurrentMsg) {
        const group = this.admin.getGroupById(this.chatTarget.id);
        return group ? new Group({ id: group.id }).getAllMember() : [];
      }
      return [];
    }
  },
  mounted() {
    this.$store.commit('sandBox/SWITCH_USER');
  }
};
</script>

<style lang="scss" scoped>
.k-container ::v-deep aside,
.k-container ::v-deep section,
.k-container ::v-deep header,
.k-container ::v-deep div {
  box-sizing: border-box;
}
.k-container {
  --sb-header-height: 60px;
}
.k-sb-main {
  // height: 100%;
  // flex: 1;
}
.k-chat-main {
  flex-grow: 1;
}
.k-container ::v-deep .k-chat-header {
  height: var(--sb-header-height);
}
.k-chat-header {
  display: flex;
  align-items: center;
  border-bottom: 2px solid #e9e9e9;
  background-color: #f2f2f2;
}
.k-chat-header-title {
  font-size: 16px;
  font-style: normal;
}
@media screen and (max-width: 1000px) {
  .aside-group {
    // display: none;
  }
}
.aside-group,
.aside-users {
  transition: all 0.3s ease;
}
</style>
