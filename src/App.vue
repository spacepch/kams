<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style scoped lang="less">
#app {
  height: 100%;
}
</style>

<script>
export default {
  name: 'App',
  mounted() {
    this.$dialog({ title: '注意', content: '版本更新后请清除localStorage数据！' })
  }
};
</script>
