<template>
  <mo-button @click="showToast">toast</mo-button>
  <mo-button @click="showToast2">toast2</mo-button>
  <mo-button @click="showLoading">loading</mo-button>
  <mo-button @click="getFeeb">getFeeb</mo-button>
</template>

<script>
import { sendMessageFromExtPageToBackground } from '@/util/chromeUtil';
import { mapGetters } from 'vuex';

export default {
  name: 'index.vue',
  computed: {
    ...mapGetters('account', ['currentAccount']),
  },
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
    async getFeeb() {
      const { data } = await sendMessageFromExtPageToBackground('getFeeb', {
        wif: this.currentAccount.wif,
      });
      console.log(data);
    },
  },
};
</script>

<style scoped></style>
