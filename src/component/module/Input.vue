<template>
  <input
    class="mo-input"
    :type="type"
    :placeholder="placeholder"
    :value="$attrs.modelValue"
    @input="handleInput"
    @change="handleChange"
  />
</template>
<script>
import i18n from '@/i18n';
export default {
  name: 'mo-input',
  props: {
    size: {
      type: String,
      default: 'medium',
    },
    type: {
      type: String,
      default: 'text',
    },
    placeholder: {
      type: String,
      default: i18n('pleaseInput'),
    },
  },
  methods: {
    handleInput(e) {
      this.$emit('update:modelValue', e.target.value);
      this.$emit('onInput', e);
    },
    handleChange(e) {
      this.$emit('update:modelValue', e.target.value);
      this.$emit('onChange', e);
    },
  },
};
</script>

<style lang="less">
.mo-input {
  box-sizing: border-box;
  width: 100%;
  border: 1px solid var(--border-color);
  outline: 0;
  height: 64px;
  line-height: 64px;
  padding: 0 24px;
  font-size: 28px;
  border-radius: var(--border-radius);
  transition: var(--transition);

  &:active,
  &:focus {
    border-color: var(--primary-color-active);
    box-shadow: var(--box-shadow);
  }
}
</style>
