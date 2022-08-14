<template>
  <div>
    <div>{{ user }}</div>
    <div>{{ $filter.satoshisToBSV(balance) }}BSV</div>
    <button @click="handleLogout">logout</button>
    <div>
      <input type="text" v-model="sendAddress" />
      <input type="number" v-model="sendAmount" />
      <button @click="handleSend">send</button>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { getBalance } from '@/lib/messageHandler';
import { createQrCode } from '@/util';
import { sendMessageFromExtPageToBackground } from '@/util/chromeUtil';

export default {
  name: 'page-home',
  computed: {
    ...mapGetters({
      user: 'user/user',
    }),
  },
  data() {
    return {
      balance: 0,
      sendAddress: '',
      sendAmount: 0,
    };
  },
  created() {
    this.getBalance();
    this.drawQrCode();
  },
  methods: {
    ...mapActions('user', ['setUser']),
    async getBalance() {
      const { data } = await sendMessageFromExtPageToBackground('getBalance', {
        wif: this.user.wif,
      });
      this.balance = data;
    },
    async handleLogout() {
      await sendMessageFromExtPageToBackground('resetWallet');
      this.setUser();
      this.$router.replace({
        path: '/login',
      });
    },
    async drawQrCode() {
      const dataUrl = await createQrCode(this.user.address);
    },
    async handleSend() {
      if (this.sendAmount < 2000) {
        return;
      }
      const res = await sendMessageFromExtPageToBackground('sendAmount', {
        amount: this.sendAmount,
        address: this.sendAddress,
        wif: this.user.wif
      });
      console.log(res);
    },
  },
};
</script>
