<template>
  <div class="k-chat-main chat-empty">
    <template v-if="getCurrentMsg">
      <!-- 聊天内容 -->
      <div ref="chatBox" class="k-chat-box pps-scrollbar">
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
          :contenteditable="messagingEnabled"
        >
          {{ messagingEnabled ? null : '禁言中...' }}
        </div>
        <div class="operation">
          <div v-show="replyMsg.name" class="reply-chat-wrapper">
            <span class="content">{{ replyMsg.name }}：{{ replyMsg.content }}</span>
            <i @click="cancelReplyMsgFn" class="el-icon-circle-close"></i>
          </div>
          <pps-button
            :disabled="!messagingEnabled"
            @click="sendMessageFn"
            theme="confirm"
            class="k-chat-send-btn"
          >
            发送
          </pps-button>
        </div>
      </div>
    </template>
    <el-empty v-else description="" style="height: 100%" :image="LOGO"></el-empty>
  </div>
</template>

<script>
import LOGO from '@/assets/favicon-gray.svg';
import { mapGetters, mapActions } from 'vuex';
import User from '@/utils/sandBox/user';
import Administrators from '@/utils/sandBox/administrators';
import kSbMessage from './message.vue';
// import wsBus from '@/utils/sandBox/wsBus';
export default {
  name: 'k-chat-main',
  components: { kSbMessage },
  data() {
    return {
      LOGO,
      message: '',
      lastRange: null,
      replyMsg: { name: null, content: null },
      admin: new Administrators()
    };
  },
  methods: {
    ...mapActions('sandBox', ['send']),
    sendMessageFn(e) {
      if (e.key === 'Enter') e.preventDefault();
      const u = new User(this.getCurrentUser);
      if (this.chatTarget.isGroup) {
        const res = u.sendMessageToGroup({
          id: this.chatTarget.id,
          content: this.message,
          replyMsg: this.replyMsg
        });

        // 获取消息
        const msg = res.data.message;

        // 角色映射
        const roleMap = {
          lord: 'owner',
          member: 'member',
          admin: 'admin',
          'super-admin': 'owner'
        };
        const role = u.groups.find((item) => item.id === res.data.gid).role;

        // 发送ws消息
        this.send({
          event: 'on_message',
          time: msg.date,
          type: 1,
          messageId: msg.id,
          message: msg.content,
          messageAlt: msg.content,
          userId: msg.role,
          groupId: res.data.gid,
          sender: {
            nickname: u.name,
            role: roleMap[role]
          }
        });
      } else {
        const res = u.sendMessageToFriend({
          id: this.chatTarget.id,
          content: this.message,
          replyMsg: this.replyMsg
        });
        if (this.chatTarget.id === 'user-super-admin') this.sendMsgToBot(res, u);
      }
      this.message = '';
      this.$refs.input.innerHTML = '';
      this.cancelReplyMsgFn();
      this.$refs.input.focus();
      this.scrollToBottom(true);
    },
    sendMsgToBot(msg, sender) {
      const msg_data = msg.data.message;
      this.send({
        event: 'on_message',
        time: msg_data.date,
        type: 0,
        messageId: msg_data.id,
        message: msg_data.content,
        messageAlt: msg_data.content,
        userId: msg.data.sender,
        sender: {
          nickname: sender.name
        }
      });
    },
    saveRange() {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        this.lastRange = selection.getRangeAt(0);
      }
    },
    async setGroupAdminFn() {
      const { value: mid } = await this.$prompt('请输入群成员id', '设置群管理员', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      });
      const res = new User(this.getCurrentUser).setGroupAdmin({
        gid: this.chatTarget.id,
        mid
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
      console.log(msg);
      let name;
      if (this.chatTarget.isGroup) {
        name = this.admin.getUserById(msg.role).name;
      } else {
        name = this.admin.getUserById(msg.sender).name;
      }
      this.replyMsg = { name, content: msg.content };
      this.$refs.input.focus();
    },
    handleMenuAction(action) {
      this.$emit('handleMenuAction', action);
    },
    cancelReplyMsgFn() {
      this.replyMsg = { name: null, content: null };
    },
    scrollToBottom(smooth = false) {
      const container = this.$refs.chatBox;
      if (!container) return;
      this.$nextTick(() => {
        if (smooth) {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth'
          });
        } else {
          container.scrollTop = container.scrollHeight;
        }
      });
    }
  },
  computed: {
    ...mapGetters('sandBox', ['getCurrentUser', 'getAllUser', 'getCurrentMsg']),
    messagingEnabled() {
      if (this.chatTarget.isGroup) {
        const curMember = new User(this.getCurrentUser);
        const isAdmin = curMember._isAdmin(this.chatTarget.id);
        if (isAdmin) return true;
        const isGroupMute = this.getCurrentMsg.isMute;
        const isMute = this.getCurrentMsg.muteMembers.includes(curMember.id);
        return !(isGroupMute || isMute);
      }
      return true;
    },
    messageList() {
      const cmsg = this.getCurrentMsg;
      if (!cmsg) return [];
      let messageList;
      if (Array.isArray(cmsg)) {
        messageList = cmsg;
      } else {
        messageList = cmsg.messages;
      }
      return messageList;
    }
  },
  watch: {
    getCurrentMsg(val) {
      this.cancelReplyMsgFn();
      if (this.$refs.input) {
        this.$refs.input.focus();
      }
    }
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
    },
    ws: {}
  },
  mounted() {
    if (this.$refs.input) {
      this.$refs.input.focus();
    }
    this.$nextTick(() => {
      this.scrollToBottom();
    });
  },
  updated() {
    this.scrollToBottom();
  }
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
    .operation {
      display: flex;
      justify-content: space-between;
      .k-chat-send-btn {
        margin-left: auto;
      }
      .reply-chat-wrapper {
        display: flex;
        align-items: center;
        font-size: 12px;
        border-radius: 4px;
        padding: 6px 8px;
        background: var(--sb-reply-bg);
        color: var(--sb-reply-color);

        .content {
          // height: 1em;
          max-width: 15em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .el-icon-circle-close {
          width: 1em;
          margin-left: 5px;
          cursor: pointer;
        }
      }
    }
  }
}
.chat-empty {
  // height: calc(var(--k-main) - var(--sb-header-height));
  height: 100%;
}
</style>
