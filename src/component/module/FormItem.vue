<template>
  <div :class="['form-item', submitItem && 'submit-item', inline && 'inline']">
    <label class="form-item-label" v-if="label">{{ label }}</label>
    <div class="form-item-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'mo-form-item',
  props: {
    label: {
      type: String,
      default: '',
    },
    submitItem: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="less">
.form-item {
  .form-item-label {
    display: block;
    height: 64px;
    line-height: 64px;
    font-size: 26px;
    color: var(--second-text-color);
    &:after {
      content: ':';
    }
  }

  .form-item-content {
    display: block;
  }

  & + .form-item {
    margin-top: 20px;
  }

  &.submit-item {
    margin-top: 40px;
  }

  &.inline {
    display: flex;
    align-items: center;

    .form-item-content {
      margin-left: 20px;
    }
  }
}
</style>
