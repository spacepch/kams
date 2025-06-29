<template>
  <div class="editor-wrapper">
    <div
      class="editor"
      ref="editor"
      contenteditable="true"
      @input="onInput"
      @keydown="onKeydown"
      @click="onClick"
    ></div>

    <!-- 用户下拉提示框 -->
    <ul v-if="showUserList" class="user-list" :style="listStyle">
      <li
        v-for="(user, index) in filteredUsers"
        :key="user.id"
        :class="{ active: index === activeIndex }"
        @mousedown.prevent="selectUser(user)"
      >
        {{ user.name }}
      </li>
    </ul>
    <pps-button theme="text">@qwe</pps-button>
  </div>
</template>
<script>
export default {
  data() {
    return {
      showUserList: false,
      users: [
        { id: 1, name: '张三' },
        { id: 2, name: '李四' },
        { id: 3, name: '王五' }
      ],
      filteredUsers: [],
      activeIndex: 0,
      mentionQuery: '',
      listStyle: {
        top: '0px',
        left: '0px'
      },
      lastRange: null
    };
  },
  methods: {
    onInput() {
      const selection = window.getSelection();
      this.lastRange = selection.getRangeAt(0).cloneRange();

      const text = this.getTextBeforeCursor();
      const atIndex = text.lastIndexOf('@');
      if (atIndex !== -1) {
        this.mentionQuery = text.slice(atIndex + 1);
        this.filteredUsers = this.users.filter(user =>
          user.name.includes(this.mentionQuery)
        );
        if (this.filteredUsers.length > 0) {
          this.showUserList = true;
          this.activeIndex = 0;
          this.updateListPosition();
        } else {
          this.showUserList = false;
        }
      } else {
        this.showUserList = false;
      }
    },

    onKeydown(e) {
      if (!this.showUserList) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.activeIndex = (this.activeIndex + 1) % this.filteredUsers.length;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.activeIndex =
          (this.activeIndex - 1 + this.filteredUsers.length) %
          this.filteredUsers.length;
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.selectUser(this.filteredUsers[this.activeIndex]);
      } else if (e.key === 'Escape') {
        this.showUserList = false;
      }
    },

    onClick() {
      this.showUserList = false;
    },

    selectUser(user) {
      const range = this.lastRange;
      if (!range) return;

      // 删除@关键词
      const text = this.getTextBeforeCursor();
      const atIndex = text.lastIndexOf('@');
      range.setStart(range.endContainer, atIndex);
      range.deleteContents();

      // 插入 span 标签作为 mention
      const mentionNode = document.createElement('span');
      mentionNode.textContent = `@${user.name}`;
      mentionNode.contentEditable = "false";
      mentionNode.className = 'mention-tag';

      range.insertNode(mentionNode);

      // 添加空格并设置光标
      const space = document.createTextNode('\u00A0');
      mentionNode.parentNode.insertBefore(space, mentionNode.nextSibling);

      // 设置光标位置
      range.setStartAfter(space);
      range.setEndAfter(space);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);

      this.showUserList = false;
    },

    getTextBeforeCursor() {
      const sel = window.getSelection();
      if (!sel.rangeCount) return '';
      const range = sel.getRangeAt(0);
      const preRange = range.cloneRange();
      preRange.selectNodeContents(this.$refs.editor);
      preRange.setEnd(range.endContainer, range.endOffset);
      return preRange.toString();
    },

    updateListPosition() {
      this.$nextTick(() => {
        const sel = window.getSelection();
        if (!sel.rangeCount) return;
        const range = sel.getRangeAt(0).cloneRange();
        const rect = range.getBoundingClientRect();
        this.listStyle.top = rect.bottom + window.scrollY + 'px';
        this.listStyle.left = rect.left + window.scrollX + 'px';
      });
    }
  }
};
</script>
<style scoped>
.editor-wrapper {
  position: relative;
  width: 400px;
}
.editor {
  border: 1px solid #ccc;
  padding: 10px;
  min-height: 100px;
  font-size: 14px;
  line-height: 1.5;
}
.mention-tag {
  background: #e6f3ff;
  color: #0077cc;
  padding: 0 4px;
  border-radius: 3px;
}
.user-list {
  position: absolute;
  background: #fff;
  border: 1px solid #ccc;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 200px;
  z-index: 999;
}
.user-list li {
  padding: 6px 10px;
  cursor: pointer;
}
.user-list li.active {
  background-color: #eee;
}
</style>
