<template>
  <k-sb-aside class="aside-group">
    <ul>
      <li v-for="(item, index) in getMemberList" :key="index">
        {{ item.id }}-{{ item.role }}
      </li>
    </ul>
    <button @click="test">ttt</button>
  </k-sb-aside>
</template>

<script>
import kSbAside from '@/components/layout/aside';
export default {
  name: 'sb-right-aside',
  components: {
    kSbAside
  },
  props: {
    group: {
      type: Object,
      default() {
        return null;
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    test() {
      console.log(this.group);
    }
  },
  computed: {
    getMemberList() {
      return this.group?.members ?? [];
    }
  },
  mounted() {}
};
</script>

<style>
.empty {
  height: calc(var(--k-main-height) - var(--k-footer-height));
}
.aside-group {
  width: var(--sb-aside-width);
  background: #f2f2f2;
  border: 2px solid #e9e9e9;
  border-top: none;
}
</style>
