<template>
  <button class="gray-btn">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'gray-button'
};
</script>

<style lang="scss">
.gray-btn {
  width: 33px;
  height: 33px;
  border: none;
  background-color: #eeeeee;
  border-radius: 5px;
  color: #636c76;
  margin-right: 10px;
  padding: 0;

  &:hover {
    background-color: #e2e2e2;
  }
  &:active {
    background-color: #d7d7d7;
  }

  &:nth-of-type(1) {
    margin-left: 10px;
  }
}
</style>
