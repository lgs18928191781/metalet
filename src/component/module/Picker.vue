<template>
  <teleport to="body">
    <transition name="fade" v-if="$attrs.modelValue">
      <div class="mo-picker" v-if="$attrs.modelValue" @click="handleClose">
        <mo-card :class="['picker-container', placement]" @click.stop="() => {}">
          <h1 v-if="title">{{ title }}</h1>
          <div v-if="list && list.length" class="list">
            <template v-for="item in list">
              <div class="item" @click="handleClick(item)">
                <span>{{ labelToText(item.label) }}</span>
              </div>
            </template>
          </div>
          <slot v-else></slot>
        </mo-card>
      </div>
    </transition>
  </teleport>
</template>

<script>
export default {
  name: 'mo-picker',
  props: {
    placement: {
      type: String,
      default: 'bottom',
    },
    title: {
      type: String,
      default: '',
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    handleClick(item) {
      this.$emit('onItemClick', item);
      this.handleClose();
    },
    handleClose() {
      this.$emit('onClose');
      this.$emit('update:modelValue', false);
    },
    labelToText(label) {
      if (typeof label === 'function') {
        return label();
      }
      return label;
    },
  },
};
</script>
<style scoped lang="less">
.mo-picker {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;

  .picker-container {
    position: absolute;
    width: 100%;
    left: 0;
    padding: 0;
    border-radius: var(--border-radius-more);

    /deep/ .card-content {
      padding: 0;
    }

    &.top {
      bottom: 0;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }

    &.bottom {
      bottom: 0;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }

    .list {
      .item {
        text-align: center;
        cursor: pointer;
        padding: 36px;
        border-bottom: 1px solid var(--second-border-color);
        transition: var(--transition);

        &:hover {
          color: var(--primary-color);
        }

        &:last-child {
          border-bottom: 0;
        }
      }
    }
  }
}
</style>
