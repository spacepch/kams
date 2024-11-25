<template>
  <k-container direction="horizontal" class="left-aside">
    <!-- 切换用户导航栏 -->
    <k-sb-aside class="aside-users">
      <header class="k-chat-header">
        <el-tooltip effect="dark" content="添加用户" placement="right">
          <div class="add-user-avatar" @click="show.createUser = true">
            <img class="add-user" :src="ADD_USER_IMG" alt="添加用户" />
          </div>
        </el-tooltip>
      </header>
      <template #inner>
        <k-menu
          v-if="getAllUser.length"
          :default-active="getCurrentUser?.id"
          active-color="#752bec"
          :active-shape="['circle']"
          text-color="#061e26"
          background-color="#f2f2f2"
          mode="column"
        >
          <k-menu-item
            v-for="(user, index) in getAllUser"
            :key="index"
            :index="user.id"
            width="60"
            height="60"
            @click="switchUserFn(user.id)"
          >
            <pps-context-menu
              :menus="[{ label: '发起群聊', uid: `${user.id}`, task: 1 }]"
              @select="contextMenuFn"
            >
              <template slot="prepend">
                <el-tooltip class="item" effect="dark" content="账户信息" placement="top">
                  <pps-icon icon="pps-icon-account" @click="show.userInfo = true"></pps-icon>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="好友" placement="top">
                  <pps-icon icon="pps-icon-contact" @click="show.friendList = true"></pps-icon>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="群聊" placement="top">
                  <pps-icon icon="pps-icon-group" @click="show.groupList = true"></pps-icon>
                </el-tooltip>
              </template>
              <div class="delete-user" slot="append">
                <div @click="contextMenuFn({ uid: `${user.id}`, task: 2 })">
                  {{ `移除 ${user.name}` }}
                </div>
              </div>
              <template v-slot:item="{ menu }">
                <div
                  class="menu-item"
                  v-for="(item, index) in menu"
                  :key="index"
                  @click="contextMenuFn(item)"
                >
                  {{ item.label }}
                </div>
              </template>
              <div class="user-avatar" slot="content">
                <!-- <img class="user-avatar-img" alt="" /> -->
                <pps-avatar :src="user.avatar" size="40"></pps-avatar>
              </div>
            </pps-context-menu>
          </k-menu-item>
        </k-menu>
      </template>
      <div class="fill-empty"></div>
      <el-tooltip v-if="0" effect="dark" content="移除用户" placement="right">
        <div class="remove-user-button" @click="removeUserFn">
          <img :src="REMOVE_USER" alt="移除用户" />
        </div>
      </el-tooltip>
    </k-sb-aside>

    <!-- 好友群聊 列表 -->
    <k-sb-aside class="aside-list">
      <header class="k-chat-header">
        <k-tab :tabs="['私聊', '群聊']" @changeTab="toggleMsgTabFn"></k-tab>
        <gray-button class="icon-btn" @click.native="show.addFriend = true">
          <svg
            t="1723230695956"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="34315"
            width="16"
            height="16"
            data-spm-anchor-id="a313x.search_index.0.i6.27883a81IeQ0Uy"
          >
            <path
              d="M914.618182 477.090909H546.909091V109.381818c0-18.618182-16.290909-34.909091-34.909091-34.909091s-34.909091 16.290909-34.909091 34.909091v367.709091H109.381818c-18.618182 0-34.909091 16.290909-34.909091 34.909091s16.290909 34.909091 34.909091 34.909091h367.709091v367.709091c0 18.618182 16.290909 34.909091 34.909091 34.909091s34.909091-16.290909 34.909091-34.909091V546.909091h367.709091c18.618182 0 34.909091-16.290909 34.909091-34.909091s-16.290909-34.909091-34.909091-34.909091z"
              fill="#7a7a7a"
              p-id="34316"
            ></path>
          </svg>
        </gray-button>
        <gray-button class="icon-btn" v-show="1">
          <pps-icon icon="pps-icon-side-show"></pps-icon>
        </gray-button>
      </header>
      <template #inner>
        <k-menu
          class="list"
          v-if="messageList?.length"
          active-color="#752bec"
          :active-shape="['background']"
          text-color="#061e26"
          background-color="#f0e8fd"
          mode="column"
        >
          <k-menu-item
            v-for="(item, index) in messageList"
            :key="index"
            :index="item.id"
            height="60"
          >
            <div class="list-item">
              <img class="avatar" alt="" />
              <pps-avatar :src="item.avatar" size="40" :title="item.name"></pps-avatar>
              <div class="name" :title="item.name">{{ item.name }}</div>
              <span class="closeBtn" @click="deleteFriendMsgFn(item)">
                <i class="el-icon-circle-close"></i>
              </span>
            </div>
          </k-menu-item>
        </k-menu>
      </template>
    </k-sb-aside>

    <!-- 创建用户 对话框 -->
    <pps-dialog
      :show.sync="show.createUser"
      @canceled="cancelFn"
      @confirmed="createUserFn"
      title="创建用户"
    >
      <template v-slot:content>
        <pps-form>
          <!-- <div class="user-input-label">名称</div> -->
          <pps-input label="昵称" :content.sync="createUser.name" placeholder="请输入昵称" />
          <!-- <div class="user-input-label">账号</div> -->
          <pps-input label="账号" :content.sync="createUser.id" placeholder="请输入账号" />
          <!-- <div class="user-input-label">年龄</div> -->
          <pps-input
            label="年龄"
            :content.sync="createUser.age"
            type="number"
            placeholder="请输入年龄"
          />
          <div class="user-sex-wrapper">
            性别：
            <el-radio v-model="createUser.sex" label="男">男</el-radio>
            <el-radio v-model="createUser.sex" label="女">女</el-radio>
          </div>
          <!-- <div class="user-input-label">头像</div> -->
          <pps-input label="头像" :content.sync="createUser.avatar" placeholder="请输入https地址" />
        </pps-form>
      </template>
    </pps-dialog>

    <!-- 移除用户 对话框 -->
    <pps-dialog
      :show.sync="show.removeUser"
      @confirmed="removeUserFn(removeUser)"
      title="移除用户"
      :content="`确定要移除${removeUser}用户吗？`"
    ></pps-dialog>

    <!-- 添加对象 对话框 -->
    <pps-dialog
      class="add-friend-dialog"
      :after-show="emitTabUpdate"
      :show.sync="show.addFriend"
      title="全站搜索"
    >
      <template v-slot:content>
        <pps-input
          @input="searchFn"
          :content.sync="searchDialog.input"
          :placeholder="`请输入${searchDialog.tabs[searchDialog.index]} ID`"
        />
        <k-tab ref="k-tab" :tabs="searchDialog.tabs" @changeTab="switchSearchTabFn">
          <template v-slot:thumb>
            <div class="thumb"></div>
          </template>
        </k-tab>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column align="center" label="搜索结果">
            <template slot-scope="scope">
              <img class="avatar" :src="scope.row.avatar" alt="" />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="name" label="昵称"></el-table-column>
          <el-table-column align="center" prop="id" label="id"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <pps-button @click="addFriendFn(scope.row.id)">添加</pps-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </pps-dialog>

    <!-- 创建群聊 对话框 -->
    <pps-dialog
      class="create-group-dialog"
      :show.sync="show.createGroup"
      @confirmed="createGroupFn"
      title="发起群聊"
    >
      <template v-slot:content>
        <div class="create-group-content">
          <div class="left" style="text-align: center">
            <h4>好友列表</h4>
            <el-table
              @selection-change="handleSelectionChange"
              :show-header="false"
              :data="getCurrentUser.friends"
            >
              <el-table-column type="selection" align="right"></el-table-column>
              <el-table-column align="center">
                <template slot-scope="scope">
                  <img :src="scope.row.avatar" alt="" />
                </template>
              </el-table-column>
              <el-table-column prop="name"></el-table-column>
            </el-table>
          </div>
          <div class="right">
            <pps-input label="群聊ID" :content.sync="createGroup.id" placeholder="请输入ID" />
            <pps-input label="群聊名称" :content.sync="createGroup.name" placeholder="请输入名称" />
            <pps-input
              label="群聊头像"
              :content.sync="createGroup.avatar"
              placeholder="请输入链接"
            />
          </div>
        </div>
      </template>
    </pps-dialog>

    <!-- 好友列表 -->
    <pps-dialog :show.sync="show.friendList" title="好友列表">
      <template v-slot:content>
        <el-table :show-header="true" :data="getCurrentUser.friends">
          <el-table-column align="center" label="头像">
            <template slot-scope="scope">
              <pps-avatar :src="scope.row.avatar" size="40"></pps-avatar>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="id" label="id"></el-table-column>
          <el-table-column align="center" prop="name" label="昵称"></el-table-column>
        </el-table>
      </template>
    </pps-dialog>

    <!-- 群聊列表 -->
    <pps-dialog :show.sync="show.groupList" title="群聊列表">
      <template v-slot:content>
        <el-table :data="getCurrentUser.groups">
          <el-table-column align="center" label="群聊头像">
            <template slot-scope="scope">
              <pps-avatar :src="scope.row.avatar" size="40"></pps-avatar>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="id" label="群聊id"></el-table-column>
          <el-table-column align="center" prop="name" label="群聊名称"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <pps-button
                :disabled="scope.row.role !== 'lord'"
                theme="danger"
                @click="removeGroupFn(scope.row)"
              >
                解散
              </pps-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </pps-dialog>

    <!-- 用户信息 -->
    <pps-dialog :show.sync="show.userInfo" title="用户信息">
      <template v-slot:content>
        <div class="user-info-wrapper">
          <pps-avatar :src="getCurrentUser.avatar" size="40"></pps-avatar>
        </div>
        <el-descriptions class="margin-top" :column="2" border>
          <el-descriptions-item>
            <template slot="label">昵称</template>
            {{ getCurrentUser.name }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">ID</template>
            {{ getCurrentUser.id }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">年龄</template>
            {{ getCurrentUser.age }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">性别</template>
            {{ getCurrentUser.sex }}
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </pps-dialog>
  </k-container>
</template>

<script>
import { mapGetters } from 'vuex';
// import debounce from 'debounce';
import kContainer from '@/components/layout/container';
import kMenuItem from '@/components/menus/menu-item.vue';
import kMenu from '@/components/menus/';
import kSbAside from '@/components/layout/aside';
import kTab from './tab/tab.vue';
import User from '@/utils/sandBox/user';
import Administrators from '@/utils/sandBox/administrators';
import ADD_USER_IMG from '@/assets/addAvatar.svg';
import REMOVE_USER from '@/assets/removeAvatar.svg';
import grayButton from '../ui/grayButton.vue';
// import { Dialog } from '@/ppsUI/packages';

export default {
  name: 'sb-left-aside',
  components: { kSbAside, kContainer, kMenu, kMenuItem, kTab, grayButton },
  data() {
    return {
      users: [],
      admin: null,
      ADD_USER_IMG,
      REMOVE_USER,
      messageMode: 0,
      messageList: [],
      show: {
        createUser: false,
        createGroup: false,
        removeUser: false,
        addFriend: false,
        friendList: false,
        groupList: false,
        userInfo: false
      },
      createUser: {
        name: null,
        avatar: null,
        id: null,
        age: null,
        sex: '男'
      },
      createGroup: {
        id: null,
        name: null,
        avatar: null,
        members: [],
        checkList: []
      },
      removeUser: null,
      searchDialog: {
        tabs: ['用户', '群聊', '机器人'],
        index: 0,
        input: ''
      },
      tableData: []
    };
  },
  methods: {
    switchUserFn(id) {
      this.getMessageList(id);
      this.$store.commit('sandBox/SWITCH_USER', id);
    },
    removeUserFn(id) {
      const admin = new Administrators();
      admin.removeUserById(id);
    },
    createUserFn() {
      const adder = this.createUser;
      const hasData = adder.id && adder.name && adder.age && adder.sex;
      if (!hasData) {
        this.$dialog({ title: '警告', content: '请填写完整信息' })
          .then((action) => {
            this.show.createUser = true;
          })
          .catch();
        return;
      }
      // eslint-disable-next-line no-unused-vars
      const newUser = new User({
        numId: adder.id,
        name: adder.name,
        age: adder.age,
        sex: adder.sex,
        avatar: adder.avatar
      });
      const res = newUser.mount();
      if (!res) {
        this.$dialog({ title: '警告', content: '用户已存在' });
      }
      this.cancelFn();
    },
    createGroupFn() {
      const admin = new Administrators();
      const res = admin.createGroup({
        id: this.createGroup.id,
        name: this.createGroup.name,
        lord: this.getCurrentUser.id,
        avatar: this.createGroup.avatar,
        members: this.createGroup.checkList
      });
      if (!res) {
        this.$dialog({ title: '警告', content: '群聊创建失败！信息不完整或已存在' })
          .then((action) => {
            this.show.createGroup = true;
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    handleSelectionChange(val) {
      this.createGroup.checkList = val;
      // console.log(val);
    },
    cancelFn() {
      this.createUser = {
        name: null,
        avatar: null,
        id: null,
        age: null,
        sex: null
      };
    },
    contextMenuFn(menu) {
      this.removeUser = menu.uid;
      if (menu.task === 2) this.show.removeUser = true;
      if (menu.task === 1) this.show.createGroup = true;
    },
    toggleMsgTabFn(tab) {
      this.messageMode = tab;
      this.getMessageList(this.getCurrentUser.id);
    },
    switchSearchTabFn(tab) {
      this.searchDialog.index = tab;
      if (this.searchDialog.input) {
        this.searchFn();
      }
    },
    searchFn() {
      this.tableData = [];
      this.$nextTick(() => {
        const id = this.searchDialog.input;
        const admin = new Administrators();
        switch (this.searchDialog.index) {
          case 0:
            admin.getUserById(id) && this.tableData.push(admin.getUserById(id));
            break;
          case 1:
            admin.getGroupById(id) && this.tableData.push(admin.getGroupById(id));
            break;
          case 2:
            // this.tableData = admin.getAllRobots();
            break;
        }
      });
    },
    addFriendFn(id) {
      const user = new User(this.getCurrentUser);
      switch (this.searchDialog.index) {
        case 0:
          user.addFriend(id);
          break;
        case 1:
          break;
        case 2:
          // this.tableData = admin.getAllRobots();
          break;
      }
    },
    emitTabUpdate() {
      this.$refs['k-tab'].changeTabFn();
    },
    getMessageList(id) {
      const user = new User(this.getCurrentUser);
      this.messageList = [];
      if (this.messageMode) {
        this.messageList = user.getAllGroups();
      } else {
        this.messageList = user.getAllFriend() || [];
      }
    },
    deleteFriendMsgFn(friend) {
      const curUser = new User(this.getCurrentUser);
      console.log(curUser.deleteFriendMessage(friend.id));
      this.getMessageList(this.getCurrentUser.id);
    },
    removeGroupFn(group) {
      const user = new User(this.getCurrentUser);
      const res = user.removeGroupById(group.id);
      if (!res) {
        this.$dialog({ title: '警告', content: '群聊删除失败！' });
      }
    }
  },
  computed: {
    ...mapGetters('sandBox', ['getCurrentUser', 'getAllUser'])
  },
  mounted() {
    // console.log(this.getAllUser);
    // console.log(this.getCurrentUser);
  }
};
</script>

<style lang="scss" scoped>
.left-aside {
  height: var(--k-main);

  .aside-users {
    width: 60px;
    background-color: #f2f2f2;
    border-bottom: 2px solid #e9e9e9;

    .k-chat-header {
      position: sticky;
      top: 0;
      min-height: 60px;
      z-index: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      // background-color: #e9e9e9;
      border-bottom: 2px solid #e9e9e9;

      & ::v-deep .add-user-avatar {
        width: 45px;
        height: 45px;

        &:hover {
          transform: scale(1.1);
          transition: all 0.3s ease;
        }

        img {
          width: 100%;
          height: 100%;
          vertical-align: bottom;
          border-radius: 50%;
          cursor: pointer;
          &:hover {
            background-color: #fff;
          }
        }
      }
    }
    .user-avatar {
      width: 40px;
      height: 40px;
      transition: transform 0.15s ease;

      &:hover {
        transform: scale(1.1);
      }
      &:active {
        transform: scale(0.9);
      }
      .user-avatar-img {
        width: 100%;
        height: 100%;
        vertical-align: bottom;
        border-radius: 50%;
      }
    }
    & ::v-deep .pps-context-menu_wrapper {
      width: 150px;
      .pps-context-menu_prepend {
        div {
          height: 100%;
          padding: 4px;
          &:hover {
            background: #f5f5f5;
          }
        }
      }
      .delete-user {
        width: 100%;
        padding: 5px;
        border-radius: inherit;
        color: red;
        &:hover {
          background: #f5f5f5;
        }
      }
      .menu-item {
        padding: 5px;
        cursor: pointer;
        border-radius: inherit;
        &:hover {
          background: #f5f5f5;
        }
      }
    }
    .remove-user-button {
      position: sticky;
      bottom: 0;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      border-top: 2px solid #e9e9e9;
      box-sizing: border-box;
      cursor: pointer;

      img {
        width: 45px;
        border-radius: 50%;
        &:hover {
          background-color: #fff;
        }
      }
    }
    & ::v-deep .k-aside-inner {
      &::-webkit-scrollbar {
        width: 0px;
      }
    }
    .fill-empty {
      height: 0;
      flex-grow: 1;
    }
  }
  .aside-list {
    flex-grow: 1;
    background-color: #fff;
    border: 2px solid #e9e9e9;
    border-top: none;

    .k-chat-header {
      display: flex;
      align-items: center;
      border-bottom: 2px solid #e9e9e9;

      .icon-btn {
        &:nth-of-type(1) {
          margin-left: 10px;
        }
      }
      .k-tab-wrapper {
        margin-left: 15px;
      }
    }

    .list {
      .k-menu-item {
        border-radius: initial;
        margin-block-start: 0;
        .list-item {
          display: inline-flex;
          align-items: center;
          width: 100%;
          padding: 0 10px;
          .name {
            margin-inline-start: 10px;
          }
          .closeBtn {
            display: none;
            margin-left: auto;
          }
        }
        &:hover {
          .closeBtn {
            display: block;
          }
        }
      }
    }
  }
  .pps-form {
    box-sizing: border-box;
    padding-left: 20px;
    .user-input-label {
      margin-top: 10px;
      margin-bottom: 5px;
    }
    .user-sex-wrapper {
      height: 38px;
      line-height: 38px;
      margin-top: 10px;
      margin-bottom: 5px;
    }
  }
  .add-friend-dialog {
    height: 100%;
    @media screen and (max-width: 700px) {
      width: 100%;
    }
    .pps-dialog-window {
      .pps-input {
        width: 100%;
      }
      .k-tab-wrapper {
        margin-top: 20px;
        background: #fff;
        margin-bottom: 20px;
        .thumb {
          position: absolute;
          bottom: 0;
          height: 3px;
          width: 60px;
          background-color: blueviolet;
        }
      }
      .el-table__body {
        width: auto !important;
      }
    }
    .avatar {
      border-radius: 50%;
      width: 35px;
    }
  }
  .create-group-dialog {
    height: 100%;
    .create-group-content {
      display: flex;
      flex-direction: column-reverse;
      gap: 20px;
      width: 100%;
      img {
        width: 30px;
        border-radius: 50%;
      }
    }
    .pps-input-label {
      width: 60px;
      text-align: right;
    }
    @media screen and (max-width: 700px) {
      width: 100%;
    }
  }
}

.empty {
  height: calc(var(--k-main-height) - var(--k-footer-height));
}
</style>
