<template>
  <button
    v-bind="$attrs"
    v-on="$listeners"
    class="pps-button"
    :class="[theme ? `pps-button-${theme}` : `pps-button-default`]"
  >
    <slot>pps-button</slot>
  </button>
</template>

<script>
export default {
  name: 'ppsButton',
  inheritAttrs: false,
  props: {
    theme: {
      type: String,
      default() {
        return '';
      }
    },
    content: {
      type: String,
      default() {
        return 'pps-button';
      }
    },
    handleData: {
      type: Object
    }
  },
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="less">
/*================ pps-button ================*/
.pps-button + .pps-button {
  margin-left: 10px;
}

.pps-button {
  cursor: pointer;
  user-select: none;
  padding: 8px 15px;
  white-space: nowrap;
  color: #2e2e2e;
  font-weight: 500;
  font-size: 12px;
  text-align: center;
  border: none;
  border-radius: 9px;
  outline: none;
}
/* =================  end  =================== */

/*================ default ================*/

.pps-button-default {
  background-color: #fff;
  border: 1px solid #c3c5c7;
  &:hover {
    color: #32bcf2;
    border: 1px solid #32bcf2;
  }
  &:active {
    box-shadow: inset 3px 3px 5px 0px #c3c5c7;
  }
}
/*================ end ================*/

/*================ primary ================*/
.pps-button-primary {
  color: #fff;
  background: #e6a23c;
  box-shadow: inset 0px 0px 1px 1px #cb9e0a;
  &:hover {
    background: #ffc312;
  }
  &:active {
    box-shadow: inset 3px 3px 3px 2px #cb9e0a;
  }
}
/*================= end ===================*/

/*============ confirm ===============*/
.pps-button-confirm {
  color: #fff;
  background-color: #00aeed;
  box-shadow: inset 0px 0px 1px 1px #3298f2;
  &:active {
    box-shadow: inset 3px 3px 3px 2px #32b0e1;
  }
  &:hover {
    background-color: #40c5f1;
  }
  &[disabled] {
    &,
    &:hover,
    &:active {
      background-color: #e6e6e6;
      box-shadow: initial;
      cursor: not-allowed;
      background: #00aeed;
    }
  }
}
/*================ end ================*/

/*============== warn ===============*/
.pps-button-warn {
  color: #fff;
  background-color: rgb(252, 40, 40);
  box-shadow: inset -0px 0px 1px 1px rgb(148, 5, 5);
  &:hover {
    background-color: rgb(251, 88, 88);
  }
  &:active {
    box-shadow: inset 3px 3px 3px 2px rgb(198, 6, 6);
  }
  &[disabled] {
    &,
    &:hover,
    &:active {
      background-color: #e6e6e6;
      box-shadow: initial;
      cursor: not-allowed;
      background: rgb(252, 40, 40);
    }
  }
}
/*=============== end =================*/

/*============== text =================*/
.pps-button-text {
  padding-left: 0;
  padding-right: 0;
  color: #00aeed;
  background-color: transparent;
  box-shadow: initial;
  &:hover {
    color: #40c5f1;
  }
  &:active {
    color: #3298f2;
  }
}
/*================= end =================*/
</style>
