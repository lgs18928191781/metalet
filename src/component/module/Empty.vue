<template>
  <div class="mo-empty">
    <img src="/public/img/icon-empty.svg" />
    <p>{{ message }}</p>
  </div>
</template>
<script>
import i18n from '@/i18n';
export default {
  name: 'mo-empty',
  props: {
    message: {
      type: String,
      default() {
        return i18n('empty');
      },
    },
  },
};
</script>
<style scoped lang="less">
.mo-empty {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 80px;

  img {
    width: 200px;
  }

  p {
    color: var(--third-text-color);
    margin-top: 30px;
  }
}
</style>
