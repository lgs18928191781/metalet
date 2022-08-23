<template>
  <button :class="className" :disabled="disabled" v-bind:="$attrs">
    <slot></slot>
  </button>
</template>
<script>
export default {
  name: 'mo-button',
  props: {
    type: {
      type: String,
      default: 'normal',
    },
    round: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    simple: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'medium',
    },
  },
  computed: {
    className() {
      return [
        'mo-button',
        this.type,
        this.size,
        this.disabled && 'disabled',
        this.simple && 'simple',
        this.round && 'round',
      ];
    },
  },
};
</script>
<style lang="less">
.mo-button {
  background-color: var(--primary-color);
  color: #fff;
  border: 0;
  outline: 0;
  text-align: center;
  height: 64px;
  line-height: 64px;
  padding: 0 36px;
  font-size: 28px;
  font-weight: bold;
  border-radius: var(--border-radius);
  transition: var(--transition);
  box-sizing: border-box;

  &:hover {
    background: var(--primary-color-hover);
    box-shadow: var(--box-shadow);
  }

  &:active {
    background: var(--primary-color-active);
    box-shadow: var(--box-shadow);
  }

  & + .mo-button {
    margin-left: 20px;
  }

  &.round {
    border-radius: 99px;
  }

  &.small {
    height: 54px;
    line-height: 54px;
    padding: 0 24px;
    font-size: 24px;
    font-weight: normal;
  }

  &.large {
    height: 74px;
    line-height: 74px;
    padding: 0 48px;
    font-size: 32px;
    font-weight: bold;
  }

  &.simple {
    border: 1px solid var(--primary-color);
    background-color: #fff;
    color: var(--primary-color);

    &:hover {
      color: var(--primary-color-hover);
      border-color: var(--primary-color-hover);
    }

    &:active {
      color: var(--primary-color-active);
      border-color: var(--primary-color-active);
    }
  }

  &.disabled {
    cursor: not-allowed;
    background-color: var(--primary-color-disabled);
    box-shadow: none;

    &.simple {
      background-color: #fff;
      color: var(--primary-color-disabled);
      border-color: var(--primary-color-disabled);
    }
  }
}
</style>
