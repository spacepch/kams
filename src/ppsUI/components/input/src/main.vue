<template>
  <div class="pps-input-wrapper">
    <label v-if="label" :for="label" class="pps-input-label">{{ label }}:</label>
    <div class="pps-input__prepend" v-if="$slots.prepend">
      <slot name="prepend"></slot>
    </div>
    <div
      :class="[
        { [theme]: !disabled },
        { 'is-disabled': disabled },
        { 'pps-input--prepend': $slots.prepend },
        { 'pps-input--append': $slots.append }
      ]"
      class="pps-input-inner"
    >
      <!-- <component v-if="icon" :is="dynamicComponent"></component> -->
      <pps-icon :icon="icon" v-if="icon"></pps-icon>
      <input
        ref="input"
        :id="label"
        v-bind="$attrs"
        v-on="$listeners"
        :type="type"
        class="pps-input"
        :disabled="disabled"
        :placeholder="placeholder"
        v-model.trim="keyWord"
      />
      <span class="pps-input-suffix" v-if="clearable" @click="clearFn()">
        <i class="icon-clear"></i>
      </span>
      <div class="operation" v-if="$slots.default">
        <slot></slot>
      </div>
    </div>
    <div class="pps-input__append" v-if="$slots.append">
      <slot name="append"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ppsInput',
  inheritAttrs: false,
  data() {
    return {
      keyWord: ''
    };
  },
  props: {
    placeholder: {
      type: String,
      default() {
        return '请输入内容';
      }
    },
    theme: {
      type: String,
      default() {
        return 'white';
      }
    },
    type: {
      type: String,
      default() {
        return 'text';
      }
    },
    icon: {
      type: String,
      default() {
        return '';
      }
    },
    content: {},
    label: {
      type: String,
      default() {
        return null;
      }
    },
    disabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    clearable: {
      type: Boolean,
      default() {
        return false;
      }
    },
    'after-clear': {
      type: Function,
      default() {
        return () => {};
      }
    }
  },
  methods: {
    clearFn() {
      console.log('clear');
      this.keyWord = '';
      this.$refs.input.focus();
      this.afterClear();
    }
  },
  computed: {},
  watch: {
    keyWord() {
      this.$emit('update:content', this.keyWord);
    },
    content: {
      immediate: true,
      handler(n) {
        this.keyWord = n;
      }
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
@font-face {
  font-family: iconfont;
  src: url(../../../font/elicon.woff);
}
/*=============== input默认样式设置 ===============*/

.pps-input-wrapper {
  display: flex;
  align-items: center;
  height: 36px;
  --radius: 8px;
  // justify-content: space-between;

  .pps-input-label {
    margin-right: 15px;
    cursor: pointer;
  }
  .pps-input__prepend {
    height: 100%;
    border-top-left-radius: var(--radius);
    border-bottom-left-radius: var(--radius);
    border: 1px solid #d3d5d7;
    border-right: none;
  }
  .pps-input-inner {
    position: relative;
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    height: 100%;
    border-radius: var(--radius);
    border: 1px solid #d3d5d7;
    background: #fff;
    .pps-icon {
      margin-left: 5px;
      width: auto;
      height: fit-content;
    }
    svg {
      display: block;
    }
    .pps-input {
      outline: none;
      width: 100%;
      height: 28px;
      flex-grow: 1;
      background: none;
      border: none;
      font-size: 15px;
      padding-inline: 10px;
      color: #2e2e2e;
      box-sizing: border-box;

      &[type='number']::-webkit-inner-spin-button,
      &[type='number']::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      &[type='password']::-webkit-contacts-auto-fill-button {
        display: none !important;
      }
      &::-ms-reveal,
      &::-ms-clear {
        display: none;
      }
      &:disabled {
        cursor: not-allowed;
        color: #c0c4cc;
      }
      &:hover + .pps-input-suffix .icon-clear {
        display: initial;
        cursor: pointer;
      }
      &:focus + .pps-input-suffix .icon-clear {
        display: initial;
      }
    }
    .pps-input-suffix {
      padding-inline-end: 5px;
      height: 100%;
      display: flex;
      align-items: center;
      .icon-clear {
        font-size: 14px;
        font-style: normal;
        font-family: iconfont;
        color: rgba(0, 0, 0, 0.4);
        cursor: pointer;
        display: none;
        background: #fff;

        &:hover {
          color: rgba(0, 0, 0, 0.8);
          display: initial;
        }
        &::before {
          content: '\e78d';
        }
      }
    }
    .operation {
      display: inline-flex;
      padding-inline-end: 5px;
    }
  }
  .pps-input--prepend {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .pps-input--append {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .pps-input__append {
    height: 100%;
    border-top-right-radius: var(--radius);
    border-bottom-right-radius: var(--radius);
    border: 1px solid #d3d5d7;
    border-left: none;

    .pps-button {
      // margin-left: 5px;
      background: transparent;
      border: none;
      height: 100%;
      background: #e3e5e7;
      border-radius: 0;
      border-top-right-radius: var(--radius);
      border-bottom-right-radius: var(--radius);
    }
  }
  /*=============== 白色系搜索框设置 ===============*/
  .white {
    display: flex;
    flex-direction: row;
    align-items: center;
    border: 1px solid #d3d5d7;
    background: #fff;
    transition: 0.2s cubic-bezier(0.65, 0.05, 0.36, 1);
    .pps-input {
      color: #2e2e2e;
    }
    &:focus-within {
      border-color: #409eff;
      box-shadow: 0px 0px 2px 0px #409eff;
    }
    &:hover {
      border-color: #409eff;
      transition: all 50ms linear 50ms;
    }
  }
  /*===================== end =====================*/

  /*=============== 黑色系搜索框设置 ===============*/
  .black {
    // position: relative;
    height: 46px;
    border: 2px solid #8f8f8f;
    border-radius: 15px 15px 15px 15px;
    background: #2e2e2e;
    input {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 10px;
      margin: auto;
      outline: none;
      width: 200px;
      height: 30px;
      background: none;
      border: none;
      font-size: 15px;
      color: #fff;
      &:focus {
        border-bottom: 2px solid #fff;
      }
      &:hover {
        filter: brightness(120%);
      }
    }
    button {
      position: absolute;
      right: 6px;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 50px;
      height: 35px;
      color: #2e2e2e;
      font-weight: bold;
    }
  }
  /*===================== end =====================*/
  .is-disabled {
    background: #f5f7fa;
    cursor: not-allowed;
  }

  & + & {
    margin-top: 20px;
  }
}

.pps-input-error::placeholder {
  color: red;
}
</style>
