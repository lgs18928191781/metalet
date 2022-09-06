<template>
  <div :class="className" v-bind:="$attrs">
    <div class="card-header" v-if="hasHeader">
      <slot name="header"></slot>
    </div>
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'mo-card',
  props: {
    shadow: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    className() {
      return ['mo-card', this.shadow && 'shadow'];
    },
    hasHeader() {
      return !!this?.$slots?.header || false;
    },
  },
};
</script>
<style lang="less">
.mo-card {
  background: #fff;
  border-radius: var(--border-radius);
  box-sizing: border-box;

  &.shadow {
    box-shadow: var(--box-shadow);
  }

  & + .mo-card {
    margin-top: 24px;
  }

  .card-content {
    padding: 32px;
  }
}
</style>
