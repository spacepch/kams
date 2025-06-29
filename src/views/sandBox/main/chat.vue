<template>
  <div class="k-chat-main chat-empty">
    <template v-if="getCurrentMsg">
      <!-- 聊天内容 -->
      <div class="k-chat-box pps-scrollbar">
        <k-sb-message
          v-for="item in messageList"
          :message="item"
          :chatTarget="chatTarget"
          :isSelf="isSelfFn(item.role)"
          :key="item.id"
        ></k-sb-message>
      </div>
      <!-- 输入框 -->
      <div class="k-chat-input-box">
        <div ref="input" class="k-chat-input" role="textbox" contenteditable="true"></div>
        <!-- <pps-input :content.sync="message" placeholder="请输入内容"></pps-input> -->
        <pps-button class="k-chat-send-btn" theme="confirm" @click="sendMessageFn">发送</pps-button>
      </div>
    </template>
    <el-empty v-else description="" style="height: 100%" :image="LOGO"></el-empty>
  </div>
</template>

<script>
import LOGO from '@/assets/favicon-gray.svg';
import { mapGetters } from 'vuex';
import User from '@/utils/sandBox/user';
import kSbMessage from './message.vue';
export default {
  name: 'k-chat-main',
  components: { kSbMessage },
  data() {
    return {
      LOGO,
      messageList: [],
      message: ''
    };
  },
  props: {
    chatTarget: {
      type: Object,
      default() {
        return null;
      }
    }
  },
  methods: {
    sendMessageFn() {
      const u = new User(this.getCurrentUser);
      if (this.chatTarget.isGroup) {
        const res = u.sendMessageToGroup({ id: this.chatTarget.id, content: this.message });
        console.log(res);
      } else {
        const res = u.sendMessageToFriend({
          id: this.chatTarget.id,
          content: this.message
        });
        // '最近需要快速开发一个微信小程序商城，大家有没有开源的原生小程序前端代码推荐啊。简单的就行。'
        console.log(res);
      }
    },
    isSelfFn(sender) {
      if (sender === 'self') {
        return true;
      } else if (sender === 'friend') {
        return false;
      } else {
        if (sender === this.getCurrentUser.id) {
          return true;
        } else {
          return false;
        }
      }
    }
  },
  computed: {
    ...mapGetters('sandBox', ['getCurrentUser', 'getAllUser', 'getCurrentMsg'])
  },
  watch: {
    getCurrentMsg(val) {
      if (!val) {
        // 处理消息为空的情况
        this.messageList = [];
        return;
      }
      if (Array.isArray(val)) {
        this.messageList = val;
      } else {
        this.messageList = val.messages;
      }
    },
    getCurrentUser(val) {
      //
    }
  },
  mounted() {
    // this.messageList = this
  },
  updated() {
    console.log('updated');
    if (this.getCurrentMsg) {
      this.$refs.input.focus();
    }
  }
};
</script>

<style lang="scss" scoped>
.k-chat-main {
  display: flex;
  flex-direction: column;
  background: #f2f2f2;
  width: 100%;
  height: 100%;

  .k-chat-box {
    height: 100%;
    flex: 1;
    flex-basis: 0;
    overflow-y: auto;
    overflow-x: hidden;

    .message-list {
    }
  }

  .k-chat-input-box {
    padding: 10px;
    position: relative;
    height: 150px;
    background: #f2f2f2;
    border-top: 2px solid #e9e9e9;
    border-bottom: 2px solid #e9e9e9;
    box-sizing: border-box;
    .k-chat-input {
      height: 70%;
      overflow: auto;
      outline: none;
      overflow-wrap: break-word;
      white-space: pre-wrap;
      word-break: break-all;
      font-weight: normal;
      font-style: normal;
      background: transparent;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    .k-chat-send-btn {
      position: absolute;
      right: 10px;
      bottom: 10px;
    }
  }
}
.chat-empty {
  // height: calc(var(--k-main) - var(--sb-header-height));
  height: 100%;
}
</style>
