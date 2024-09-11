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

<style lang="scss">
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
  box-sizing: border-box;

  & + & {
    margin-left: 10px;
  }
}
$textColor: #00aeed;
$btnBgColors: #fff, #e6a23c, $textColor, #fc2828, transparent;
$btnNames: default, primary, confirm, danger, text;

@for $i from 1 through length($btnBgColors) {
  $name: nth($btnNames, $i);
  .pps-button-#{nth($btnNames, $i)} {
    $color: nth($btnBgColors, $i);
    background-color: $color;
    &:hover {
      @if $name != default {
        background-color: lighten($color, 10%);
      } @else {
        color: $textColor;
        border: 1px solid $textColor;
      }
    }
    &:active {
      background-color: darken($color, 5%);
      box-shadow: inset 3px 3px 3px 2px darken($color, 20%);
    }
    &:disabled {
      background-color: lighten($color, 20%);
      border: 1px solid lighten($color, 20%);
      box-shadow: initial;
      cursor: not-allowed;
    }
    @if $name == default {
      color: initial;
      border: 1px solid #c3c5c7;
    } @else if $name == text {
      color: $textColor;
      padding-left: 0;
      padding-right: 0;
    } @else {
      color: #fff;
      border: 1px solid darken($color, 10%);
    }
  }
}
</style>
