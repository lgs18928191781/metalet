<template>
  <teleport to="body">
    <transition name="fade">
      <div class="mo-dialog" v-if="$attrs.modelValue" @click="handleClose">
        <mo-card @click.stop="() => {}" :style="{ width }" v-bind="$attrs">
          <slot></slot>
        </mo-card>
      </div>
    </transition>
  </teleport>
</template>
<script>
import Card from './Card.vue';

export default {
  name: 'mo-dialog',
  components: {
    [Card.name]: Card,
  },
  props: {
    width: {
      type: [String, Number],
      default: '80%',
    },
  },
  methods: {
    handleClose() {
      this.$emit('onClose');
      this.$emit('update:modelValue', false);
    },
  },
};
</script>
<style scoped>
.mo-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
