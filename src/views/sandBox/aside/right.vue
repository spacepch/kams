<template>
  <k-sb-aside class="aside-group">
    <div class="title">群聊成员</div>
    <template #inner>
      <ul class="member-list">
        <li
          class="member-item"
          v-for="(user, index) in getMemberList"
          :key="index"
          @click="showMemberInfoFn(user.id)"
        >
          <pps-context-menu
            :menus="[
              { label: '发起群聊', uid: `${user.id}`, task: 1 },
              { label: '移除群聊', uid: `${user.id}`, task: 2 }
            ]"
            @select="contextMenuFn"
          >
            <template v-slot:item="{ menu }">
              <div
                class="menu-item pps-context-menu-item"
                v-for="(item, index) in menu"
                :key="index"
                @click="contextMenuFn(item)"
              >
                {{ item.label }}
              </div>
            </template>
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
    <!-- <button @click="test">console</button> -->
  </k-sb-aside>
</template>

<script>
import { tranRoleMixin } from '@/mixin/index';
import kSbAside from '@/components/layout/aside';
import kMenuItem from '@/components/menus/menu-item.vue';
import kMenu from '@/components/menus/';
// import User from '@/utils/sandBox/user';
import Administrators from '@/utils/sandBox/administrators';
import Group from '@/utils/sandBox/group';
export default {
  name: 'sb-right-aside',
  components: {
    kSbAside,
    // eslint-disable-next-line vue/no-unused-components
    kMenu,
    // eslint-disable-next-line vue/no-unused-components
    kMenuItem
  },
  props: {
    chatTarget: {
      type: [Object, Boolean],
      default() {
        return null;
      }
    }
  },
  mixins: [tranRoleMixin],
  data() {
    return {
      admin: new Administrators()
    };
  },
  methods: {
    test() {
      console.log('test', this.getMemberList);
    },
    contextMenuFn(item) {
      console.log(item);
    },
    showMemberInfoFn(member) {
      console.log(member);
    }
  },
  computed: {
    getMemberList() {
      let memberList = [];
      if (this.chatTarget.isGroup) {
        const { id, name, lord } = this.admin.getGroupById(this.chatTarget.id);
        memberList = new Group({ id, name, lord }).getAllMember();
        console.log(memberList);
      }
      return memberList;
    }
  },
  mounted() {}
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
      padding: 8px;
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
