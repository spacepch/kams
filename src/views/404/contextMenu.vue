<template>
  <div ref="container" class="pps-context-menu-area">
    <slot name="content"></slot>
    <transition name="pps-context">
      <div
        ref="menu"
        v-if="isShowMenus"
        v-show="showContextMenu"
        class="pps-context-menu_wrapper"
        :style="menuStyle"
        @click="handleMenuClick"
        @keydown="handleKeydown"
        tabindex="-1"
        role="menu"
        :aria-hidden="!showContextMenu"
      >
        <div class="pps-context-menu_prepend" v-if="$slots.prepend">
          <slot name="prepend"></slot>
        </div>
        <ul class="pps-context-menu_inner" role="none">
          <slot name="item" :menus="menus" :activeIndex="activeIndex">
            <li
              v-for="(item, index) in menus"
              :key="item.key || index"
              :class="[
                'pps-context-menu-item',
                {
                  'pps-context-menu-item--disabled': item.disabled,
                  'pps-context-menu-item--active': activeIndex === index,
                  'pps-context-menu-item--divider': item.divider
                }
              ]"
              :role="item.divider ? 'separator' : 'menuitem'"
              :aria-disabled="item.disabled"
              @click="handleSelect(item, index, $event)"
              @mouseenter="activeIndex = index"
            >
              <template v-if="!item.divider">
                <span v-if="item.icon" class="pps-context-menu-item__icon">
                  <i :class="item.icon"></i>
                </span>
                <span class="pps-context-menu-item__label">{{ item.label }}</span>
                <span v-if="item.shortcut" class="pps-context-menu-item__shortcut">
                  {{ item.shortcut }}
                </span>
              </template>
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
  props: {
    menus: {
      type: Array,
      default: () => [],
      validator(value) {
        return value.every((item) => typeof item === 'object' && (item.label || item.divider));
      }
    },
    trigger: {
      type: String,
      default: 'contextmenu',
      validator: (value) => ['click', 'contextmenu'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number,
      default: 1000
    }
  },
  data() {
    return {
      showContextMenu: false,
      x: 0,
      y: 0,
      activeIndex: -1,
      menuWidth: 0,
      menuHeight: 0
    };
  },
  computed: {
    isShowMenus() {
      return (this.menus && this.menus.length > 0) || this.$slots.prepend || this.$slots.append;
    },
    menuStyle() {
      return {
        left: this.x + 'px',
        top: this.y + 'px',
        zIndex: this.zIndex
      };
    },
    availableMenus() {
      return this.menus ? this.menus.filter((item) => !item.divider) : [];
    }
  },
  methods: {
    handleSelect(item, index, event) {
      if (item.disabled || item.divider) {
        return;
      }

      event.stopPropagation();
      this.closeMenu();
      this.$emit('select', item, index);

      // 如果菜单项有自定义处理函数
      if (typeof item.handler === 'function') {
        item.handler(item, index);
      }
    },

    handleMenuClick(event) {
      event.stopPropagation();
    },

    handleKeydown(event) {
      const { key } = event;
      const menuCount = this.availableMenus.length;

      switch (key) {
        case 'Escape':
          event.preventDefault();
          this.closeMenu();
          break;

        case 'ArrowDown':
          event.preventDefault();
          this.activeIndex = this.activeIndex < menuCount - 1 ? this.activeIndex + 1 : 0;
          break;

        case 'ArrowUp':
          event.preventDefault();
          this.activeIndex = this.activeIndex > 0 ? this.activeIndex - 1 : menuCount - 1;
          break;

        case 'Enter':
        case ' ':
          event.preventDefault();
          if (this.activeIndex >= 0 && this.activeIndex < menuCount) {
            const activeItem = this.availableMenus[this.activeIndex];
            this.handleSelect(activeItem, this.activeIndex, event);
          }
          break;
      }
    },

    openMenu(event) {
      if (this.disabled || !this.isShowMenus) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      // 先显示菜单以获取尺寸
      this.showContextMenu = true;
      this.activeIndex = -1;

      this.$nextTick(() => {
        this.calculatePosition(event.clientX, event.clientY);
        this.focusMenu();
      });
    },

    calculatePosition(clientX, clientY) {
      if (!this.$refs.menu) return;

      const menu = this.$refs.menu;
      const menuRect = menu.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const padding = 5; // 距离屏幕边缘的最小距离

      // 水平位置计算
      if (clientX + menuRect.width + padding > windowWidth) {
        // 如果右侧空间不足，菜单显示在鼠标左侧
        this.x = Math.max(padding, clientX - menuRect.width);
      } else {
        this.x = clientX;
      }

      // 垂直位置计算
      if (clientY + menuRect.height + padding > windowHeight) {
        // 如果下方空间不足，菜单显示在鼠标上方
        this.y = Math.max(padding, clientY - menuRect.height);
      } else {
        this.y = clientY;
      }

      // 确保菜单不超出屏幕边界
      this.x = Math.min(this.x, windowWidth - menuRect.width - padding);
      this.y = Math.min(this.y, windowHeight - menuRect.height - padding);
      this.x = Math.max(this.x, padding);
      this.y = Math.max(this.y, padding);
    },

    closeMenu() {
      this.showContextMenu = false;
      this.activeIndex = -1;
      this.$emit('close');
    },

    focusMenu() {
      this.$nextTick(() => {
        if (this.$refs.menu) {
          this.$refs.menu.focus();
        }
      });
    },

    handleOutsideClick(event) {
      if (this.showContextMenu && !this.$refs.menu?.contains(event.target)) {
        this.closeMenu();
      }
    },

    handleOutsideContextMenu(event) {
      if (this.showContextMenu && !this.$refs.container?.contains(event.target)) {
        this.closeMenu();
      }
    },

    bindEvents() {
      const container = this.$refs.container;
      if (!container) return;

      // 根据trigger类型绑定不同的触发事件
      if (this.trigger === 'click') {
        container.addEventListener('click', this.openMenu, false);
      } else if (this.trigger === 'contextmenu') {
        container.addEventListener('contextmenu', this.openMenu, false);
      }

      // 绑定全局事件
      document.addEventListener('click', this.handleOutsideClick, true);
      document.addEventListener('contextmenu', this.handleOutsideContextMenu, true);
      window.addEventListener('resize', this.closeMenu);
      window.addEventListener('scroll', this.closeMenu, true);
    },

    unbindEvents() {
      const container = this.$refs.container;
      if (container) {
        container.removeEventListener('click', this.openMenu);
        container.removeEventListener('contextmenu', this.openMenu);
      }

      document.removeEventListener('click', this.handleOutsideClick);
      document.removeEventListener('contextmenu', this.handleOutsideContextMenu);
      window.removeEventListener('resize', this.closeMenu);
      window.removeEventListener('scroll', this.closeMenu);
    }
  },

  mounted() {
    this.bindEvents();
  },

  beforeDestroy() {
    this.unbindEvents();
  },

  watch: {
    showContextMenu(newVal) {
      if (newVal) {
        this.$emit('open');
      }
    }
  }
};
</script>

<style scoped>
.pps-context-menu-area {
  position: relative;
}

.pps-context-menu_wrapper {
  position: fixed;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
  min-width: 120px;
  max-width: 300px;
  max-height: 400px;
  overflow-y: auto;
  user-select: none;
  outline: none;
}

.pps-context-menu_inner {
  list-style: none;
  margin: 0;
  padding: 0;
}

.pps-context-menu-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  line-height: 1.4;
  color: #333333;
  transition: background-color 0.2s;
}

.pps-context-menu-item:hover:not(.pps-context-menu-item--disabled),
.pps-context-menu-item--active:not(.pps-context-menu-item--disabled) {
  background-color: #f5f5f5;
}

.pps-context-menu-item--disabled {
  color: #cccccc;
  cursor: not-allowed;
}

.pps-context-menu-item--divider {
  height: 1px;
  background-color: #e0e0e0;
  margin: 4px 0;
  padding: 0;
  cursor: default;
}

.pps-context-menu-item__icon {
  margin-right: 8px;
  width: 16px;
  text-align: center;
}

.pps-context-menu-item__label {
  flex: 1;
}

.pps-context-menu-item__shortcut {
  margin-left: 8px;
  color: #999999;
  font-size: 12px;
}

/* 过渡动画 */
.pps-context-enter-active,
.pps-context-leave-active {
  transition: all 0.2s ease;
  transform-origin: top left;
}

.pps-context-enter,
.pps-context-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
  .pps-context-menu_wrapper {
    background: #2a2a2a;
    border-color: #404040;
    color: #ffffff;
  }

  .pps-context-menu-item {
    color: #ffffff;
  }

  .pps-context-menu-item:hover:not(.pps-context-menu-item--disabled),
  .pps-context-menu-item--active:not(.pps-context-menu-item--disabled) {
    background-color: #3a3a3a;
  }

  .pps-context-menu-item--disabled {
    color: #666666;
  }

  .pps-context-menu-item--divider {
    background-color: #404040;
  }
}
</style>
