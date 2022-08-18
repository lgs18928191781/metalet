<template>
  <div :class="className">
    <template v-for="item in list">
      <label :class="itemClassName(item)" @click="handleItemClick(item)">
        <i class="dot"></i>
        <span>
          {{ item.label }}
        </span>
      </label>
    </template>
  </div>
</template>
<script>
export default {
  name: 'mo-radio-group',
  props: {
    inline: {
      type: Boolean,
      default: true,
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    className() {
      return ['mo-radio-group', !this.inline && 'not-inline'];
    },
  },
  methods: {
    itemClassName(item) {
      return ['mo-radio', this.$attrs.modelValue === item.name && 'active'];
    },
    handleItemClick(item) {
      this.$emit('update:modelValue', item.name);
    },
  },
};
</script>
<style lang="less">
.mo-radio-group {
  &.not-inline {
    .mo-radio {
      display: flex;
      margin: 0;
    }
  }
}

.mo-radio {
  display: inline-flex;
  align-items: center;
  font-size: 28px;
  min-height: 64px;
  cursor: pointer;
  transition: var(--transition);
  color: var(--primary-text-color);
  margin-right: 20px;

  i {
    width: 32px;
    height: 32px;
    margin-right: 12px;
    border-radius: 32px;
    box-sizing: border-box;
    border: 2px solid var(--border-color);
    position: relative;
  }

  &:hover {
    color: var(--second-text-color);
  }

  &.active {
    color: var(--primary-color);

    i {
      border-color: var(--primary-color);

      &:after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 20px;
        border-radius: 20px;
        background-color: var(--primary-color);
      }
    }
  }
}
</style>
