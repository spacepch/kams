<template>
  <div ref="container" class="pps-context-menu-area">
    <slot name="content"></slot>
    <transition name="pps-context">
      <div
        ref="menu"
        v-show="showContextMenu"
        class="pps-context-menu_wrapper"
        :style="{ left: x + 'px', top: y + 'px' }"
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
              @click="handleSelect(item)"
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
    handleSelect(item) {
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
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const crect = this.$refs.container.getBoundingClientRect();
      this.$refs.menu.style.display = '';
      const ulrect = this.$refs.menu.getBoundingClientRect();
      this.$refs.menu.style.display = 'none';
      if (windowHeight - crect.bottom < ulrect.height) {
        this.isBottom = true;
        console.warn('[pps-ui]底部超出');
        this.y = windowHeight - ulrect.height - crect.height;
      }
      if (windowWidth - crect.right < ulrect.width) {
        this.isRight = true;
        console.warn('[pps-ui]右侧超出');
        this.x = windowWidth - ulrect.width;
      }
    },
    closeMenu() {
      this.showContextMenu = false;
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

<style lang="scss" scoped>
.pps-context-menu-area {
  position: relative;
  --radius: 5px;
  .pps-context-menu_wrapper {
    transition: 0.3s ease;
    position: fixed;
    min-width: 100px;
    border-radius: var(--radius);
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.145);
    background: #ffffff;
    padding: 10px;
    z-index: 100;
    color: initial;
    .pps-context-menu_prepend {
      display: flex;
      align-items: center;
      justify-content: space-around;
      border-top-left-radius: var(--radius);
      border-top-right-radius: var(--radius);
      background: #fff;
      min-height: 20px;
      border-bottom: 1px solid #0505050f;
      margin-bottom: 4px;
      padding-bottom: 4px;
    }
    .pps-context-menu_append {
      display: flex;
      align-items: center;
      border-bottom-left-radius: var(--radius);
      border-bottom-right-radius: var(--radius);
      background: #fff;
      min-height: 20px;
      border-top: 1px solid #0505050f;
      margin-top: 4px;
      padding-top: 4px;
    }
    .pps-context-menu_inner {
      .pps-context-menu-item {
        padding: 5px 10px;
        cursor: pointer;
        &:hover {
          background: #f5f5f5;
        }
      }
    }
  }
  .pps-context-enter,
  .pps-context-leave-to {
    opacity: 0;
    transform: scale(0.5);
  }
  .pps-context-enter-to,
  .pps-context-leave {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
