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
          :memberList="memberList"
          @replyMsg="replyMsgFn"
          @handleMenuAction="handleMenuAction"
        ></k-sb-message>
        User类踢出成员方法待完善
      </div>
      <!-- 输入框 -->
      <div class="k-chat-input-box">
        <div
          ref="input"
          class="k-chat-input"
          :innerHTML="message"
          @input="inputFn"
          @click="saveRange"
          @keyup="saveRange"
          @keypress.enter="sendMessageFn"
          @blur="lastRange = null"
          contenteditable="true"
        ></div>
        <div v-if="replyMsg" class="reply-chat">{{ replyMsg.name }}：{{ replyMsg.content }}</div>
        <pps-button class="k-chat-send-btn" theme="confirm" @click="sendMessageFn">发送</pps-button>
        <button @click="setGroupAdminFn">设置管理员</button>
      </div>
    </template>
    <el-empty v-else description="" style="height: 100%" :image="LOGO"></el-empty>
  </div>
</template>

<script>
import LOGO from '@/assets/favicon-gray.svg';
import { mapGetters } from 'vuex';
import User from '@/utils/sandBox/user';
import Administrators from '@/utils/sandBox/administrators';
import kSbMessage from './message.vue';
export default {
  name: 'k-chat-main',
  components: { kSbMessage },
  data() {
    return {
      LOGO,
      messageList: [],
      message: '',
      lastRange: null,
      replyMsg: null,
      admin: new Administrators()
    };
  },
  props: {
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
    sendMessageFn(e) {
      if (e.key === 'Enter') e.preventDefault();
      const u = new User(this.getCurrentUser);
      if (this.chatTarget.isGroup) {
        const res = u.sendMessageToGroup({
          id: this.chatTarget.id,
          content: this.message,
          replyMsg: this.replyMsg
        });
        console.log(res);
      } else {
        const res = u.sendMessageToFriend({
          id: this.chatTarget.id,
          content: this.message
        });
        // '最近需要快速开发一个微信小程序商城，大家有没有开源的原生小程序前端代码推荐啊。简单的就行。'
        console.log(res);
      }
      this.message = '';
      this.$refs.input.innerHTML = '';
      this.replyMsg = null;
      this.$refs.input.focus();
      // this.test();
    },
    saveRange() {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        this.lastRange = selection.getRangeAt(0);
      }
    },
    setGroupAdminFn() {
      const res = new User(this.getCurrentUser).setGroupAdmin({
        gid: this.chatTarget.id,
        mid: 'user-1'
      });
      console.log(res);
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
    },
    inputFn() {
      this.message = this.$refs.input.innerText;
    },
    mentionMember(username) {
      const input = this.$refs.input;
      input.focus();

      const selection = window.getSelection();
      selection.removeAllRanges();

      let range = null;

      // 如果 lastRange 有效，就用它，否则插到末尾
      if (this.lastRange && this.isRangeInNode(this.lastRange, input)) {
        range = this.lastRange;
      } else {
        range = document.createRange();
        range.selectNodeContents(input);
        range.collapse(false); // false 表示光标放在末尾
      }

      selection.addRange(range);

      // 插入 mention 节点
      const mentionNode = document.createElement('button');
      mentionNode.textContent = `@${username}`;
      mentionNode.contentEditable = 'false';
      mentionNode.className = 'pps-button-text pps-button';

      range.deleteContents();
      range.insertNode(mentionNode);

      // 插入空格
      const space = document.createTextNode('\u00A0');
      mentionNode.parentNode.insertBefore(space, mentionNode.nextSibling);

      // 将光标移动到空格后
      const newRange = document.createRange();
      newRange.setStartAfter(space);
      newRange.collapse(true);

      selection.removeAllRanges();
      selection.addRange(newRange);

      // 更新最后 Range
      this.lastRange = newRange;
      this.inputFn();
    },
    isRangeInNode(range, node) {
      if (!range || !node) return false;
      const container = range.commonAncestorContainer;
      return node.contains(container);
    },
    replyMsgFn(msg) {
      const name = this.admin.getUserById(msg.role).name;
      this.replyMsg = { name, ...msg };
      this.$refs.input.focus();
      console.log(this.replyMsg);
    },
    handleMenuAction(action) {
      this.$emit('handleMenuAction', action);
    }
  },
  computed: {
    ...mapGetters('sandBox', ['getCurrentUser', 'getAllUser', 'getCurrentMsg']),
    getlord() {
      const user = new User(this.getCurrentUser);
      const g = user.getGroupById(this.chatTarget.id);
      return g.lord;
    }
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
      this.replyMsg = null;
      if (this.$refs.input) {
        this.$refs.input.focus();
      }
    }
  },
  mounted() {
    console.log(this.messageList);
    if (this.$refs.input) {
      this.$refs.input.focus();
    }
  },
  updated() {}
};
</script>

<style lang="scss" scoped>
.k-chat-main {
  display: flex;
  flex-direction: column;
  background: #f2f2f2;
  width: 100%;
  min-width: 300px;
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
    .reply-chat {
      width: fit-content;
      font-size: 12px;
      border-radius: 4px;
      padding: 6px 8px;
      margin-top: 4px;
      background: var(--sb-reply-bg);
      color: var(--sb-reply-color);
    }
  }
}
.chat-empty {
  // height: calc(var(--k-main) - var(--sb-header-height));
  height: 100%;
}
</style>
