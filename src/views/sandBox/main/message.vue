<template>
  <div class="k-sb-message" :class="{ 'k-sb-message-self': isSelf }">
    <div class="date"><span v-trans-time="message.date"></span></div>
    <div class="message">
      <pps-context-menu @select="avatarContextMenuFn" :menus="getUserMenuItems()">
        <div slot="content">
          <pps-avatar
            size="36"
            :src="getUserAvatarFn(message.role)"
            style="user-select: none"
          ></pps-avatar>
        </div>
      </pps-context-menu>
      <pps-context-menu @select="testContextMenuFn" :menus="getTextMenus">
        <div slot="content">
          <div class="container">
            <div class="nickname">
              <span v-if="chatTarget.isGroup" :class="groupRole.role" class="groupRole">
                {{ tranRoleFn(groupRole.role) }}
              </span>
              <span>{{ getUserNickname }}</span>
            </div>
            <div class="content">{{ message.content || '\u00A0' }}</div>
            <div v-if="message.replyMsg" class="reply">
              {{ message.replyMsg.name }}：{{ message.replyMsg.content }}
            </div>
          </div>
        </div>
      </pps-context-menu>
    </div>
  </div>
</template>

<script>
import { tranRoleMixin } from '@/mixin/index';
import { getVisibleMenuItems } from '@/utils/sandBox/permissionService';
import Administrators from '@/utils/sandBox/administrators';
import User from '@/utils/sandBox/user';
import { mapGetters } from 'vuex';
export default {
  name: 'k-sb-message',
  data() {
    return {
      admin: new Administrators(),
      groupRole: null
    };
  },
  mixins: [tranRoleMixin],
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
    },
    memberList: {
      type: Array,
      default() {
        return [];
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
        this.$emit('replyMsg', this.message);
      }
    },
    getSenderRoleFn() {
      if (this.chatTarget.isGroup) {
        const sender = this.memberList.find(({ id }) => id === this.message.role);
        this.groupRole = sender;
      }
    },
    getUserMenuItems() {
      if (this.chatTarget.isGroup) {
        const curUer = this.memberList.find(({ id }) => id === this.getCurrentUser.id);
        const targetUser = this.memberList.find(({ id }) => id === this.message.role);
        return getVisibleMenuItems(curUer, targetUser);
      }
      return [];
    }
  },
  computed: {
    ...mapGetters('sandBox', ['getCurrentUser', 'getCurrentMsg']),
    getUserNickname() {
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
    }
  },
  created() {
    this.getSenderRoleFn();
    // console.log('message', this.groupRole);
  },
  mounted() {}
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
        display: flex;
        align-items: center;
        flex-direction: row;

        .groupRole {
          font-size: 11px;
          padding: 2px;
          line-height: 1rem;
          border-radius: 4px;
          margin-inline-end: 4px;
        }
        .admin {
          background: var(--sb-admin-bg);
          color: var(--sb-admin-color);
        }
        .lord {
          background: var(--sb-lord-bg);
          color: var(--sb-lord-color);
        }
        .super-admin {
          background: var(--sb-super-admin-bg);
          color: var(--sb-super-admin-color);
        }
      }
      .content {
        width: fit-content;
        background: #fff;
        padding: 8px;
        text-wrap-mode: wrap;
        border-radius: 8px;
        margin-top: 4px;
      }
      .reply {
        width: fit-content;
        font-size: 12px;
        border-radius: 4px;
        padding: 6px 8px;
        margin-top: 6px;
        background: var(--sb-reply-bg);
        color: var(--sb-reply-color);
        user-select: none;
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
        flex-direction: row-reverse;
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
