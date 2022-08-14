<template>
  <div class="page-home">
    <div class="mo-card money-card">
      <img class="refresh" src="/img/icon-refresh.svg" @click="fetchData" />

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
        <img class="btn" :data-clipboard-text="user.address" src="/img/icon-copy.svg" ref="outsideBtn" />
      </div>
    </div>

    <div class="ctrl-bar">
      <div class="item" @click="handleOpenDialog">
        <img src="/img/icon-qrcode.svg" />
        <span>{{ $t('home.receive') }}</span>
      </div>
      <div class="item">
        <img src="/img/icon-transfer.svg" />
        <span>{{ $t('home.send') }}</span>
      </div>
      <div class="item" @click="handleOpenHistory">
        <img src="/img/icon-history.svg" />
        <span>{{ $t('home.history') }}</span>
      </div>
    </div>
  </div>

  <transition name="fade">
    <div class="page-dialog" v-show="showDialog" @click="handleCloseDialog">
      <div class="mo-card" @click.stop="() => {}">
        <h1 class="mo-sub-title">{{ $t('home.dialogTitle') }}</h1>
        <img :src="qrcodeUrl" class="qrcode" />
        <div class="address">
          <div class="mo-text txt-hide">{{ user.address }}</div>
          <img src="/img/icon-copy.svg" @click.stop="clickOutsideBtn" />
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
      sendAmount: 0,
      qrcodeUrl: '',
      showDialog: false,
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
    handleOpenDialog() {
      this.showDialog = true;
    },
    handleCloseDialog() {
      this.showDialog = false;
    },
    clickOutsideBtn() {
      this.$refs.outsideBtn.click();
    },
    handleOpenHistory() {
      window.open(`https://scan.mvc.space/address/${this.user.address}`);
    },
  },
};
</script>
<style lang="less" scoped>
.page-home {
  .money-card {
    background-image: linear-gradient(30deg, #316dd8, #d18f68);
    border-radius: 18px;
    padding: 46px 36px 24px;
    position: relative;

    .bsv {
      font-family: 'Inter Bold';
      color: #fff;
      font-size: 62px;
      text-align: right;
      margin-top: 20px;
      .unit {
        font-size: 48px;
        font-family: 'Inter';
        width: 110px;
        display: inline-block;
        box-sizing: border-box;
        text-align: left;
        padding-left: 10px;
      }
    }

    .lcy {
      color: #f1f1f1;
      font-size: 32px;
      margin-top: 14px;
      text-align: right;

      .unit {
        font-size: 26px;
        font-family: 'Inter';
        width: 110px;
        display: inline-block;
        box-sizing: border-box;
        text-align: left;
        padding-left: 10px;
      }
    }

    .address {
      width: 50%;
      display: flex;
      align-items: center;
      margin: 40px auto 0;

      div {
        font-size: 24px;
        color: #fff;
      }
      .btn {
        margin-left: 10px;
        width: 20px;
        height: 20px;
        filter: brightness(0) invert(1);
        cursor: pointer;
        &:hover {
          color: var(--primary-color-hover);
        }
      }
    }

    .refresh {
      position: absolute;
      top: 20px;
      left: 20px;
      width: 30px;
      height: 30px;
      cursor: pointer;
      &:hover {
        transition: all 0.5s linear;
        transform: rotate(360deg);
      }
    }
  }

  .ctrl-bar {
    margin-top: 26px;
    display: flex;
    justify-content: space-between;
    .item {
      background: #fff;
      flex-grow: 1;
      margin-right: 26px;
      padding: 20px;
      border-radius: 99px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      border: 1px solid var(--primary-color);
      color: var(--primary-color);
      cursor: pointer;
      transition: all 0.2s linear;

      img {
        height: 36px;
        width: auto;
        margin-right: 8px;
        pointer-events: none;
      }

      span {
        font-size: 28px;
      }

      &:last-child {
        margin-right: 0;
      }

      &:hover {
        background-color: #f9f9f9;
        color: var(--primary-color-hover);
        border-color: var(--primary-color-hover);
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

.page-dialog {
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

  .mo-card {
    width: 80%;

    .mo-sub-title {
      text-align: center;
      margin-top: 60 - 36px;
    }

    .qrcode {
      display: block;
      margin: 60px auto 80px;
    }

    .address {
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        margin-left: 10px;
        cursor: pointer;
        width: 32px;
        height: 32px;
        filter: brightness(0) invert(0.2);

        &:hover {
          color: var(--primary-color-hover);
        }
      }
    }
  }
}
</style>
