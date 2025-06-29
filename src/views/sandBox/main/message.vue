<template>
  <div class="k-sb-message" :class="{ 'k-sb-message-self': isSelf }">
    <div class="date"><span v-trans-time="message.date"></span></div>
    <div class="message">
      <pps-context-menu @select="avatarContextMenuFn" :menus="getAvatarMenus">
        <div slot="content">
          <pps-avatar size="36" :src="getUserAvatarFn(message.role)"></pps-avatar>
        </div>
      </pps-context-menu>
      <pps-context-menu @select="testContextMenuFn" :menus="getTextMenus">
        <div slot="content">
          <div class="container">
            <div class="nickname">{{ getUserNicknameFn }}</div>
            <div class="content">{{ message.content }}</div>
          </div>
        </div>
      </pps-context-menu>
    </div>
  </div>
</template>

<script>
import Administrators from '@/utils/sandBox/administrators';
// eslint-disable-next-line no-unused-vars
import User from '@/utils/sandBox/user';
import { mapGetters } from 'vuex';
export default {
  name: 'k-sb-message',
  data() {
    return {
      admin: new Administrators()
    };
  },
  props: {
    message: {
      type: Object,
      default() {
        return {};
      }
    },
    isSelf: {
      type: Boolean,
      default: false
    },
    avatar: {
      type: String,
      default: ''
    },
    chatTarget: {
      type: Object,
      default() {
        return null;
      }
    }
  },
  methods: {
    getUserAvatarFn(role) {
      if (role === 'self') {
        return this.getCurrentUser.avatar;
      } else if (role === 'friend') {
        return this.admin.getUserById(this.message.sender).avatar;
      } else {
        return this.admin.getUserById(this.message.role).avatar;
      }
    },
    testContextMenuFn({ task }) {
      const user = new User(this.getCurrentUser);
      if (task === 0) {
        if (this.message.isGroup) {
          const res = user.deleteGroupMessage({ id: this.chatTarget.id, msgId: this.message.id });
          console.log(res);
        } else {
          const res = user.deleteFriendMessage(this.message.receiver, this.message.id);
          console.log(res);
        }
      } else if (task === 1) {
        console.log('回复消息');
      }
    },
    avatarContextMenuFn(menus) {
      console.log(menus);
    }
  },
  computed: {
    ...mapGetters('sandBox', ['getCurrentUser', 'getCurrentMsg']),
    getUserNicknameFn() {
      if (this.message.role === 'self') {
        return this.getCurrentUser.name;
      } else if (this.message.role === 'friend') {
        return this.admin.getUserById(this.message.sender).name;
      } else {
        return this.admin.getUserById(this.message.role).name;
      }
    },
    getTextMenus() {
      if (this.isSelf) {
        return [
          { label: '回复消息', task: 1 },
          { label: '删除消息', task: 0 }
        ];
      } else {
        return [{ label: '回复消息', task: 1 }];
      }
    },
    getAvatarMenus() {
      const menus_normal = [];
      if (this.chatTarget.isGroup) {
        menus_normal.push({ label: '查看资料', task: 0 });
        // const g = this.admin.getGroupById(this.getCurrentMsg.id)
        // console.log(g);

        if (!this.isSelf) {
          menus_normal.push({ label: '@ TA', task: 1 });
          menus_normal.push({ label: '添加好友', task: 2 });
          const curUser = new User(this.getCurrentUser);
          console.log(curUser._isAdmin(this.chatTarget.id));
        }
      }
      return menus_normal;
    }
  },
  mounted() {
    // console.log('mounted', this.message);
  }
};
</script>

<style lang="scss" scoped>
.k-sb-message {
  padding: 10px 10px;
  box-sizing: border-box;
  &::selection {
    background: var(--theme-hover-color);
  }
  .date {
    width: 100%;
    text-align: center;
    margin-top: 5px;
    user-select: none;
    span {
      color: #7a7a7a;
    }
  }
  .message {
    display: flex;
    flex-direction: row;
    width: 75%;
    gap: 8px;

    .container {
      flex: 1;
      .nickname {
        color: #7a7a7a;
        user-select: none;
      }
      .content {
        width: fit-content;
        background: #fff;
        padding: 8px;
        text-wrap-mode: wrap;
        border-radius: 8px;
      }
    }
    & + .k-sb-message {
      margin-top: 8px;
    }
  }
}
.k-sb-message-self {
  .message {
    flex-direction: row-reverse;
    margin-left: auto;

    .container {
      .nickname {
        text-align: end;
      }
      .content {
        color: #fff;
        background: var(--theme-color);
        margin-left: auto;
      }
    }
  }
}
</style>
