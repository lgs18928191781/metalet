<template>
  <div class="page-home">
    <div class="mo-card money-card">
      <img class="refresh" src="/public/img/icon-refresh.svg" @click="fetchData" />

      <div class="bsv">
        <span>{{ $filter.satoshisToBSV(balance) }}</span>
        <span class="unit">BSV</span>
      </div>
      <div class="lcy">
        <span>{{ $filter.satoshisToLcy(balance, rate) }}</span>
        <span class="unit">{{ rateUnit }}</span>
      </div>
      <div class="address">
        <div class="mo-text txt-hide">{{ user.address }}</div>
        <img class="btn" :data-clipboard-text="user.address" src="/public/img/icon-copy.svg" ref="outsideBtn" />
      </div>
    </div>

    <div class="ctrl-bar">
      <div class="item" @click="handleOpenReceiveDialog">
        <img src="/public/img/icon-qrcode.svg" />
        <span>{{ $t('home.receive') }}</span>
      </div>
      <div class="item" @click="handleOpenSendDialog">
        <img src="/public/img/icon-transfer.svg" />
        <span>{{ $t('home.send') }}</span>
      </div>
      <div class="item" @click="handleOpenHistory">
        <img src="/public/img/icon-history.svg" />
        <span>{{ $t('home.history') }}</span>
      </div>
    </div>
  </div>

  <transition name="fade">
    <div class="page-dialog" v-show="showReceiveDialog" @click="handleCloseReceiveDialog">
      <div class="mo-card" @click.stop="() => {}">
        <h1 class="mo-sub-title">{{ $t('home.receiveDialogTitle') }}</h1>
        <img :src="qrcodeUrl" class="qrcode" />
        <div class="address">
          <div class="mo-text txt-hide">{{ user.address }}</div>
          <img src="/public/img/icon-copy.svg" @click.stop="clickOutsideClipboardBtn" />
        </div>
      </div>
    </div>
  </transition>

  <transition name="fade">
    <div class="page-dialog" v-show="showSendDialog" @click="handleCloseSendDialog">
      <div class="mo-card" @click.stop="() => {}">
        <h1 class="mo-sub-title">{{ $t('home.sendDialogTitle') }}</h1>
        <div class="mo-form">
          <div class="form-item">
            <label class="form-item-label">{{ $t('home.yourAddress') }}</label>
            <div class="form-item content">
              <div class="txt-hide mo-text">{{ user.address }}</div>
            </div>
          </div>
          <div class="form-item">
            <label class="form-item-label">{{ $t('home.sendAddress') }}</label>
            <div class="form-item content">
              <input class="mo-input" type="text" v-model="sendAddress" :placeholder="$t('pleaseInput')" />
            </div>
          </div>
          <div class="form-item">
            <label class="form-item-label">{{ $t('home.sendAmount') }}</label>
            <div class="form-item content">
              <input class="mo-input" type="number" v-model="sendAmount" :placeholder="$t('pleaseInput')" />
            </div>
          </div>
          <hr class="mo-divider" />
          <div class="form-item" style="text-align: right">
            <button class="mo-btn simple round" @click.stop="handleCloseSendDialog">{{ $t('cancel') }}</button>
            <button class="mo-btn round" @click="handleSubmitSend">{{ $t('submit') }}</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { createQrCode } from '@/util';
import { sendMessageFromExtPageToBackground } from '@/util/chromeUtil';
import { getExchangeRate } from '@/api/common';
import ClipboardJS from 'clipboard';

export default {
  name: 'page-home',
  computed: {
    ...mapGetters({
      user: 'user/user',
      locale: 'system/locale',
    }),
    rateUnit() {
      return this.locale === 'en' ? 'USD' : 'CNY';
    },
  },
  data() {
    return {
      balance: 0,
      rate: 0,
      sendAddress: '',
      sendAmount: undefined,
      qrcodeUrl: '',
      showReceiveDialog: false,
      showSendDialog: false,
      clipboard: undefined,
    };
  },
  created() {
    this.fetchData();
    this.drawQrCode();
  },
  beforeUnmount() {
    this.clipboard.destroy();
  },
  mounted() {
    this.initClipboard();
  },
  methods: {
    ...mapActions('user', ['setUser']),
    initClipboard() {
      this.clipboard = new ClipboardJS('.btn');

      this.clipboard.on('success', function (e) {
        console.log('success');
      });

      this.clipboard.on('error', function (e) {
        console.log('error');
      });
    },
    async fetchData() {
      await this.getExchangeRate();
      await this.getBalance();
    },
    async getBalance() {
      const { data } = await sendMessageFromExtPageToBackground('getBalance', {
        wif: this.user.wif,
      });
      this.balance = data;
    },
    async getExchangeRate() {
      const { data } = await getExchangeRate();
      const { cnyRate, usdtRate } = data;
      if (this.locale === 'en') {
        this.rate = usdtRate;
      } else {
        this.rate = cnyRate;
      }
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
      this.qrcodeUrl = dataUrl;
    },
    async handleSend() {
      if (this.sendAmount < 2000) {
        return;
      }
      const res = await sendMessageFromExtPageToBackground('sendAmount', {
        amount: this.sendAmount,
        address: this.sendAddress,
        wif: this.user.wif,
      });
      console.log(res);
    },
    handleOpenReceiveDialog() {
      this.showReceiveDialog = true;
    },
    handleCloseReceiveDialog() {
      this.showReceiveDialog = false;
    },
    clickOutsideClipboardBtn() {
      this.$refs.outsideBtn.click();
    },
    handleOpenHistory() {
      window.open(`https://scan.mvc.space/address/${this.user.address}`);
    },
    handleOpenSendDialog() {
      this.showSendDialog = true;
    },
    handleCloseSendDialog() {
      this.showSendDialog = false;
      this.sendAddress = '';
      this.sendAmount = undefined;
    },
    async handleSubmitSend() {
      const { data } = await sendMessageFromExtPageToBackground('sendAmount', {
        wif: this.user.wif,
        sendAddress: this.sendAddress,
        sendAmount: this.sendAmount,
      });
      this.handleCloseSendDialog();
      await this.fetchData();
    },
  },
};
</script>
<style lang="less" scoped src="./style.less"></style>
