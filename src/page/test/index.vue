<template>
  <mo-button @click="showToast">toast</mo-button>
  <mo-button @click="showToast2">toast2</mo-button>
  <mo-button @click="showLoading">loading</mo-button>
</template>

<script>
export default {
  name: 'index.vue',
  methods: {
    showToast() {
      this.$toast({
        message: 'this is test',
      });
    },
    showToast2() {
      const toast = this.$toast({
        message: 'this is test',
        duration: 0,
      });

      setTimeout(() => {
        toast.close();
      }, 3000);
    },
    showLoading() {
      const loading = this.$loading({});
      setTimeout(() => {
        loading.close();
      }, 3000);
    },
  },
};
</script>

<style scoped></style>
