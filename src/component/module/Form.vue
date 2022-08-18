<template>
  <div class="mo-form">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'mo-form',
};
</script>
<style lang="less">
.mo-form {
  &.inline {
    display: inline-block;

    .form-item {
      margin: 0 20px 20px 0;
      display: inline-flex;
      align-items: center;

      .form-item-content {
        margin-left: 10px;
      }
    }
  }
}
</style>
