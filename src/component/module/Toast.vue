<template>
  <div :class="['mo-toast', type]">
    <div class="message" v-html="message"></div>
  </div>
</template>
<script>
export default {
  name: 'mo-toast',
  props: {
    type: {
      type: String,
      default: 'black',
    },
    message: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      default: 2500,
    },
    onClose: {
      type: Function,
      default() {
        return () => {};
      },
    },
  },
  mounted() {
    if (this.duration > 0) {
      let timer = setTimeout(() => {
        this.onClose();
      }, this.duration);
    }
  },
};
</script>
<style lang="less">
.mo-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.75);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 24px 36px;
  color: #fff;
  text-align: center;
  max-width: 80%;
  line-height: 1.75;

  &.white {
    background-color: rgba(255, 255, 255, 0.75);
    color: var(--primary-text-color);
  }
}
</style>
