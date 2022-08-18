<template>
  <div :class="className">
    <template v-for="(item, index) in list">
      <div
        :class="['mo-tab-item', item.name === $attrs.modelValue ? 'active' : undefined]"
        @click="handleItemClick(item)"
      >
        {{ item.label }}
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: 'mo-tab',
  props: {
    around: {
      type: Boolean,
      default: false,
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
      return ['mo-tab', this.around ? 'around' : ''].join(' ');
    },
  },
  methods: {
    handleItemClick(item) {
      this.$emit('update:modelValue', item.name);
    },
  },
};
</script>
<style lang="less">
.mo-tab {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  &.around {
    justify-content: space-around;

    .mo-tab-item {
      margin-right: 0;
    }
  }
}

.mo-tab-item {
  font-size: 32px;
  font-weight: bold;
  color: var(--third-text-color);
  cursor: pointer;
  padding: 14px 24px;
  margin-right: 20px;
  transition: var(--transition);
  position: relative;
  font-family: 'Inter Bold';

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 8px;
    height: 8px;
    background-color: var(--third-text-color);
    transform: translateY(-50%);
  }

  &:hover {
    color: var(--second-text-color);
    text-shadow: var(--text-shadow);
    &:before {
      background-color: var(--second-text-color);
    }
  }

  &.active {
    color: var(--primary-text-color);
    &:before {
      background-color: var(--primary-text-color);
    }
  }
}
</style>
