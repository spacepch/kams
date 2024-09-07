<template>
  <div class="k-chat-main chat-empty">
    <el-empty description=" " style="height: 100%" :image="LOGO"></el-empty>
    <template v-if="0">
      <!-- 聊天内容 -->
      <div class="k-chat-box"></div>
      <!-- 输入框 -->
      <div class="k-chat-input"></div>
    </template>
  </div>
</template>

<script>
import LOGO from '@/assets/favicon-gray.svg';
export default {
  name: 'k-chat-main',
  data() {
    return {
      LOGO
    };
  }
};
</script>

<style lang="less" scoped>
.k-chat-main {
  display: flex;
  flex-direction: column;
  background: #f2f2f2;
  width: 100%;

  .k-chat-box {
    height: 100%;
  }

  .k-chat-input {
    height: 200px;
    background: #f2f2f2;
    border-top: 2px solid #e9e9e9;
    border-bottom: 2px solid #e9e9e9;
  }
}
.chat-empty {
  height: calc(var(--k-main-height) - var(--k-footer-height) - 60px);
}
</style>
