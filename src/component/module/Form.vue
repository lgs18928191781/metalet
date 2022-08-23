<template>
  <div :class="['mo-form', inline && 'inline']">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'mo-form',
  props: {
    inline: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="less">
.mo-form {
  &.inline {
    // ...
  }
}
</style>
