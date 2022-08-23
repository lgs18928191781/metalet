<template>
  <div class="mo-card" v-bind:="$attrs">
    <slot></slot>
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
  },
};
</script>
<style lang="less">
.mo-card {
  background: #fff;
  padding: 32px;
  border-radius: var(--border-radius);
  box-sizing: border-box;

  &.shadow {
    box-shadow: var(--box-shadow);
  }

  & + .mo-card {
    margin-top: 24px;
  }
}
</style>
