<template>
  <k-sb-aside class="aside-group">
    <div class="title">群聊成员</div>
    <template #inner>
      <ul class="member-list">
        <li
          class="member-item"
          @click="viewUserProfile(user)"
          v-for="(user, index) in sortedMemberList"
          :key="index"
        >
          <pps-context-menu :menus="getUserMenuItems(user)" @select="avatarContextMenuFn">
            <div class="user-item" slot="content">
              <pps-avatar :src="user.avatar" size="20"></pps-avatar>
              <div class="user-name">{{ user.name }}</div>
              <div v-if="chatTarget.isGroup" :class="user.role" class="user-role">
                {{ tranRoleFn(user.role) }}
              </div>
            </div>
          </pps-context-menu>
        </li>
      </ul>
    </template>
  </k-sb-aside>
</template>

<script>
import { tranRoleMixin } from '@/mixin/index';
import { getVisibleMenuItems } from '@/utils/sandBox/permissionService';
import kSbAside from '@/components/layout/aside';
import Group from '@/utils/sandBox/group';
// import User from '@/utils/sandBox/user';
import Administrators from '@/utils/sandBox/administrators';
import { mapGetters } from 'vuex';
export default {
  name: 'sb-right-aside',
  components: {
    kSbAside
  },
  mixins: [tranRoleMixin],
  data() {
    return {
      admin: new Administrators()
    };
  },
  methods: {
    getUserMenuItems(user) {
      const curUer = this.memberList.find(({ id }) => id === this.getCurrentUser.id);
      const group = new Group({ id: this.chatTarget.id });
      const menu = getVisibleMenuItems(curUer, user, group);
      return menu;
    },
    handleMenuAction() {},
    viewUserProfile(user) {
      this.$emit('handleMenuAction', {
        targetUser: user,
        actionType: 'VIEW_PROFILE'
      });
    }
  },
  computed: {
    ...mapGetters('sandBox', ['getCurrentUser']),
    sortedMemberList() {
      // 角色优先级映射
      const rolePriorityMap = new Map([
        ['super-admin', 0],
        ['lord', 1],
        ['admin', 2],
        ['member', 3]
      ]);
      // 获取权重值
      const getPriority = (role) => {
        return rolePriorityMap.has(role) ? rolePriorityMap.get(role) : 4;
      };
      // 排序
      const sortedMemberList = [...this.memberList].sort((a, b) => {
        return getPriority(a.role) - getPriority(b.role);
      });
      return sortedMemberList;
    }
  },
  mounted() {
    // console.log(this.sortedMemberList);
  }
};
</script>

<style lang="scss" scoped>
.empty {
  height: calc(var(--k-main-height) - var(--k-footer-height));
}
.aside-group {
  width: var(--sb-aside-width);
  background: #f2f2f2;
  border: 2px solid #e9e9e9;
  border-top: none;

  &::v-deep .pps-context-menu-area {
    width: 100%;
    padding: 8px;
  }

  &::v-deep .k-aside-inner {
    flex-grow: 1;
  }

  .member-list {
    display: flex;
    flex-grow: 1;
    padding: 0;
    margin: 0;
    flex-direction: column;

    .member-item {
      display: flex;
      cursor: pointer;
      &:hover {
        background: var(--sb-reply-bg);
      }
    }
  }
  .user-item {
    display: flex;
    width: 100%;

    .user-name {
      margin-left: 5px;
      flex: 1;
      min-width: 0;
      // width: fit-content;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .user-role {
      // margin-left: auto;
      font-size: 11px;
      padding: 2px;
      line-height: 1rem;
      border-radius: 4px;
      white-space: nowrap;
      flex-shrink: 0;
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
}
</style>
