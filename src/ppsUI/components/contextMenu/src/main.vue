<template>
  <div ref="container" class="pps-context-menu-area">
    <slot name="content"></slot>
    <transition name="pps-context">
      <div
        ref="menu"
        v-if="isShowMenus"
        v-show="showContextMenu"
        class="pps-context-menu_wrapper"
        :style="{ left: x + 'px', top: y + 'px' }"
        @click="(e) => e.stopPropagation()"
      >
        <div class="pps-context-menu_prepend" v-if="$slots.prepend">
          <slot name="prepend"></slot>
        </div>
        <ul class="pps-context-menu_inner">
          <slot name="item" :menu="menus">
            <li
              class="pps-context-menu-item"
              v-for="(item, index) in menus"
              :key="index"
              @click="handleSelect(item, $event)"
            >
              {{ item.label }}
            </li>
          </slot>
        </ul>
        <div class="pps-context-menu_append" v-if="$slots.append">
          <slot name="append"></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'pps-context-menu',
  directives: {
    animation: {
      bind(element, binding) {
        element.animate(
          [
            { transform: 'scale(0)', opacity: 0 },
            { transform: 'scale(1)', opacity: 1 }
          ],
          {
            duration: 300,
            easing: 'ease'
          }
        );
      }
    }
  },
  props: {
    menus: {
      default() {
        return [];
      }
    },
    trigger: {
      type: String,
      default() {
        return 'contextmenu';
      }
    }
  },
  data() {
    return {
      showContextMenu: true,
      x: 0,
      y: 0,
      isBottom: false,
      isRight: false
    };
  },
  methods: {
    handleSelect(item, event) {
      event.stopPropagation();
      this.showContextMenu = false;
      this.$emit('select', item);
    },
    openMenu(e) {
      e.preventDefault();
      e.stopPropagation();
      this.setPosition();
      if (!this.isRight) this.x = e.clientX;
      if (!this.isBottom) this.y = e.clientY;
      this.showContextMenu = true;
    },
    setPosition() {
      if (!this.isShowMenus) return;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const crect = this.$refs.container.getBoundingClientRect();

      this.$refs.menu.style.display = '';
      const ulrect = this.$refs.menu.getBoundingClientRect();

      this.$refs.menu.style.display = 'none';
      if (windowHeight - crect.bottom < ulrect.height) {
        this.isBottom = true;
        // console.warn('[pps-ui]底部超出');
        this.y = windowHeight - ulrect.height - crect.height;
      }

      if (windowWidth - crect.right < ulrect.width) {
        this.isRight = true;
        // console.warn('[pps-ui]右侧超出');
        this.x = windowWidth - ulrect.width;
      }
    },
    closeMenu() {
      this.showContextMenu = false;
    },
    bindClickEvents() {
      this.$refs.container.addEventListener('click', this.openMenu, false);
      this.setPosition();
    },
    bindContextEvents() {
      this.$refs.container.addEventListener('contextmenu', this.openMenu, false);
      window.addEventListener('contextmenu', this.closeMenu, true);
      this.setPosition();
    }
  },
  computed: {
    isShowMenus() {
      return this.menus.length || this.$slots.prepend || this.$slots.append;
    }
  },
  mounted() {
    this.$refs.container.addEventListener('contextmenu', this.openMenu, false);
    window.addEventListener('click', this.closeMenu, true);
    window.addEventListener('contextmenu', this.closeMenu, true);
    this.setPosition();
  },
  beforeDestroy() {
    this.$refs.container.removeEventListener('contextmenu', this.openMenu);
    window.removeEventListener('click', this.closeMenu);
    window.removeEventListener('contextmenu', this.closeMenu);
  }
};
</script>
