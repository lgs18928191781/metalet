<template>
  <div class="page-home">
    <template v-if="account">
      <div class="mo-card money-card">
        <img class="refresh" src="/public/img/icon-refresh.svg" @click="fetchData" />

        <div class="space">
          <span>{{ $filter.satoshisToSpace(balance) }}</span>
          <span class="unit">SPACE</span>
        </div>
        <!--        <div class="lcy">-->
        <!--          <span>{{ $filter.satoshisToLcy(balance, rate) }}</span>-->
        <!--          <span class="unit">{{ rateUnit }}</span>-->
        <!--        </div>-->
        <div class="address">
          <div class="mo-text txt-hide">{{ account.address }}</div>
          <img class="btn" :data-clipboard-text="account.address" src="/public/img/icon-copy.svg" ref="outsideBtn" />
        </div>
      </div>
    </template>
    <mo-tab around v-model="curTab" :list="tabList" />
    <!-- tab1 - wallet -->
    <template v-if="curTab === 0">
      <div class="action-card">
        <mo-card class="card-item" @click="handleOpenReceiveDialog">
          <div class="one-raw">
            <img src="/public/img/icon-qrcode.svg" />
            <span>{{ $t('home.receive') }}</span>
          </div>
        </mo-card>
        <mo-card class="card-item" @click="handleOpenSendDialog">
          <div class="one-raw">
            <img src="/public/img/icon-transfer.svg" />
            <span>{{ $t('home.send') }}</span>
          </div>
        </mo-card>
        <mo-card class="card-item" @click="handleOpenHistory">
          <div class="one-raw">
            <img src="/public/img/icon-history.svg" />
            <span>{{ $t('home.history') }}</span>
          </div>
        </mo-card>
      </div>
    </template>
    <!-- tab1 - token -->
    <template v-if="curTab === 1">
      <!-- ft -->
      <div class="action-card">
        <!--        <div class="top-ctrl">-->
        <!--          <mo-button simple round @click="handleOpenTokenDialog('ft')">Add</mo-button>-->
        <!--        </div>-->
        <div class="list">
          <template v-for="(item, index) in ftInfoList" :key="index">
            <mo-card class="card-item" @click="handleOpenTransferTokenDialog(item)">
              <div class="info-row">
                <div class="head">
                  <img :src="item.logo" v-if="item && item.logo" />
                  <i v-else>{{ (item && item.name && item.name[0]) || 'T' }}</i>
                </div>
                <div class="info">
                  <div class="name">{{ item.name }}</div>
                </div>
                <div class="num">{{ item.amount }}</div>
                <div class="ctrl">
                  <i class="icon transfer"></i>
                </div>
              </div>
            </mo-card>
          </template>
        </div>
      </div>
    </template>
    <!-- tab1 - news -->
    <template v-if="curTab === 2">
      <div class="coming-soon">
        <img src="/public/img/icon-empty.svg" />
        <p>{{ $t('comingSoon') }}</p>
      </div>
    </template>
  </div>

  <!-- 接收弹窗 -->
  <mo-dialog v-model="showReceiveDialog" class="page-dialog">
    <h1 class="mo-sub-title">{{ $t('home.receiveDialogTitle') }}</h1>
    <img :src="qrcodeUrl" class="qrcode" />
    <div class="address">
      <div class="mo-text txt-hide">{{ account.address }}</div>
      <img src="/public/img/icon-copy.svg" @click.stop="clickOutsideClipboardBtn" />
    </div>
  </mo-dialog>

  <!-- 发送弹窗 -->
  <mo-dialog class="page-dialog" v-model="showSendDialog" @onClose="handleCloseSendDialog">
    <h1 class="mo-sub-title">{{ $t('home.sendDialogTitle') }}</h1>
    <mo-form>
      <mo-form-item :label="$t('home.sendAddress')">
        <mo-input
          v-model="sendAddress"
          :placeholder="$t('pleaseInput')"
          @input="handleAmountInput"
          @change="handleAmountInput"
        />
      </mo-form-item>
      <mo-form-item :label="$t('home.sendAmount')">
        <mo-input
          type="number"
          v-model="sendAmount"
          :placeholder="$t('pleaseInput') + ' ' + $t('home.unit')"
          :min="2000"
          @input="handleAmountInput"
          @change="handleAmountInput"
        />
      </mo-form-item>
      <hr class="mo-divider" />
      <mo-form-item inline :label="$t('home.yourBalance')">
        <div class="txt-hide mo-text dark">{{ $filter.satoshisToSpace(balance) }} SPACE</div>
      </mo-form-item>
      <mo-form-item inline :label="$t('home.fee')">
        <div class="txt-hide mo-text dark">{{ $filter.satoshisToSpace(fee) }} SPACE</div>
      </mo-form-item>
      <!--      <mo-form-item inline :label="$t('home.total')">-->
      <!--        <div class="txt-hide mo-text dark">{{ $filter.satoshisToSpace(sendAmount + fee) }} SPACE</div>-->
      <!--      </mo-form-item>-->
      <mo-form-item submitItem style="text-align: center">
        <mo-button simple @click="handleCloseSendDialog">{{ $t('cancel') }}</mo-button>
        <mo-button @click="handleSubmitSend">{{ $t('submit') }}</mo-button>
      </mo-form-item>
    </mo-form>
  </mo-dialog>

  <!-- 增加ft或nft -->
  <mo-dialog v-model="showTokenDialog" class="page-dialog">
    <h1 class="mo-sub-title">{{ $t('home.addTokenInfo') }}</h1>
    <mo-form>
      <mo-form-item :label="$t('home.genesis')">
        <mo-input :placeholder="$t('pleaseInput')" />
      </mo-form-item>
      <mo-form-item :label="$t('home.codehash')">
        <mo-input :placeholder="$t('pleaseInput')" />
      </mo-form-item>
      <mo-form-item submitItem style="text-align: center">
        <mo-button simple @click="handleCloseTokenDialog">{{ $t('cancel') }}</mo-button>
        <mo-button @click="handleSubmitTokenAdd">{{ $t('submit') }}</mo-button>
      </mo-form-item>
    </mo-form>
  </mo-dialog>

  <!-- 转发ft或nft -->
  <mo-dialog v-model="showTransferTokenDialog" class="page-dialog">
    <h1 class="mo-sub-title">{{ $t('home.transferTokenInfo') }}</h1>
    <mo-form>
      <mo-form-item :label="$t('home.address')">
        <mo-input :placeholder="$t('pleaseInput')" v-model="transferTokenAddress" />
      </mo-form-item>
      <mo-form-item :label="$t('home.amount')">
        <mo-input :placeholder="$t('pleaseInput')" v-model="transferTokenAmount" />
      </mo-form-item>
      <mo-form-item submitItem style="text-align: center">
        <mo-button simple @click="handleCloseTransferTokenDialog">{{ $t('cancel') }}</mo-button>
        <mo-button @click="handleSubmitTransferToken">{{ $t('submit') }}</mo-button>
      </mo-form-item>
    </mo-form>
  </mo-dialog>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import { createQrCode, spaceTosatoshis } from '@/util';
import { sendMessageFromExtPageToBackground } from '@/util/chromeUtil';
import { getExchangeRate, getFtBalance } from '@/api/common';
import ClipboardJS from 'clipboard';
import i18n from '@/i18n';

export default {
  name: 'page-home',
  computed: {
    ...mapGetters({
      account: 'account/currentAccount',
      locale: 'system/locale',
      ftList: 'token/ftList',
      nftList: 'token/nftList',
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
      showTokenDialog: false,
      clipboard: undefined,
      tabList: [
        { label: i18n('home.wallet'), name: 0 },
        { label: i18n('home.token'), name: 1 },
        { label: i18n('home.news'), name: 2 },
      ],
      curTab: 0,
      inputAmountTimer: undefined,
      fee: 0,
      unspents: [],
      tokenGenesis: '',
      tokenCodehash: '',
      tokenDialogType: '',
      ftInfoList: [],
      nftInfoList: [],
      showTransferTokenDialog: false,
      transferTokenAddress: '',
      transferTokenAmount: '',
      transferTokenItem: {},
    };
  },
  beforeUnmount() {
    this.clipboard.destroy();
  },
  mounted() {
    this.fetchData();
    this.fetchTokenInfo();
    this.drawQrCode();
    this.initClipboard();
  },
  methods: {
    ...mapActions('token', ['addFt', 'addNft', 'removeFt', 'removeNft']),
    initClipboard() {
      this.clipboard = new ClipboardJS('.btn');

      this.clipboard.on('success', (e) => {
        this.$toast({ message: i18n('copy') + ' ' + i18n('success') });
      });

      this.clipboard.on('error', (e) => {
        this.$toast({ message: i18n('copy') + ' ' + i18n('fail') });
      });
    },
    async fetchData() {
      const loading = this.$loading();
      // await this.getExchangeRate();
      await this.getBalance();
      loading.close();
    },
    async getBalance() {
      const { data } = await sendMessageFromExtPageToBackground('getBalance', {
        address: this.account.address,
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
    async drawQrCode() {
      if (this.account.address) {
        this.qrcodeUrl = await createQrCode(this.account.address);
      }
    },
    handleOpenReceiveDialog() {
      this.showReceiveDialog = true;
    },
    clickOutsideClipboardBtn() {
      this.$refs.outsideBtn.click();
    },
    handleOpenHistory() {
      window.open(`https://scan.mvc.space/address/${this.account.address}`);
    },
    async handleOpenSendDialog() {
      this.showSendDialog = true;
      const { data } = await sendMessageFromExtPageToBackground('getUnspents', {
        address: this.account.address,
      });
      this.unspents = data;
    },
    handleCloseSendDialog() {
      this.showSendDialog = false;
      this.sendAddress = '';
      this.sendAmount = undefined;
    },
    async handleSubmitSend() {
      if (!this.sendAddress) {
        return this.$toast({ message: i18n('home.pleaseInputAddress') });
      }
      if (!this.sendAmount) {
        return this.$toast({ message: i18n('home.pleaseInputAmount') });
      }
      const satoshi = spaceTosatoshis(+this.sendAmount).toNumber();
      if (satoshi < 2000) {
        return this.$toast({ message: i18n('home.amountMoreThan2000') });
      }
      if (satoshi + this.fee >= this.balance) {
        return this.$toast({ message: i18n('home.amountNotEnough') });
      }
      const { data } = await sendMessageFromExtPageToBackground('sendAmount', {
        wif: this.account.wif,
        sendAddress: this.sendAddress,
        sendAmount: satoshi,
        address: this.account.address,
      });
      this.$toast({ message: i18n('home.paySuccess') });
      this.handleCloseSendDialog();
      await this.fetchData();
    },
    handleAmountInput(e) {
      clearTimeout(this.inputAmountTimer);
      this.inputAmountTimer = setTimeout(async () => {
        if (+this.sendAmount > 0 && this.sendAddress) {
          const { data } = await sendMessageFromExtPageToBackground('countFee', {
            address: this.account.address,
            sendAmount: this.sendAmount,
            sendAddress: this.sendAddress,
            wif: this.account.wif,
            unspents: this.unspents,
          });
          this.fee = data;
        }
      }, 1000);
    },
    handleOpenTokenDialog(type) {
      this.showTokenDialog = true;
      this.tokenDialogType = type;
    },
    handleCloseTokenDialog() {
      this.showTokenDialog = false;
      this.tokenGenesis = '';
      this.tokenCodehash = '';
    },
    handleSubmitTokenAdd() {
      if (this.tokenDialogType === 'ft') {
        this.addFt({
          codehash: this.tokenCodehash,
          genesis: this.tokenGenesis,
        });
      } else if (this.tokenDialogType === 'nft') {
        this.addNft({
          codehash: this.tokenCodehash,
          genesis: this.tokenGenesis,
        });
      }
      this.handleCloseTokenDialog();
    },
    async fetchTokenInfo() {
      getFtBalance(this.account.address).then((res) => {
        const tokenMap = {};
        if (res && Array.isArray(res) && res.length) {
          for (let i of res) {
            const key = i.codeHash + '|' + i.genesis;
            const amount = i.unconfirmed + i.confirmed;
            const name = i.name;
            const symbol = i.symbol;
            const decimal = i.decimal;
            if (!tokenMap[key]) {
              tokenMap[key] = {
                codeHash: i.codeHash,
                genesis: i.genesis,
                amount,
                name,
                symbol,
                decimal,
              };
            } else {
              tokenMap[key].amount = tokenMap[key].amount + amount;
            }
          }
        }
        for (let key in tokenMap) {
          const item = tokenMap[key];
          if (item.amount > 0) {
            this.ftInfoList.push(tokenMap[key]);
          }
        }
      });
    },
    handleOpenTransferTokenDialog(item) {
      this.showTransferTokenDialog = true;
      this.transferTokenAddress = '';
      this.transferTokenAmount = '';
      this.transferTokenItem = item;
    },
    handleCloseTransferTokenDialog() {
      this.showTransferTokenDialog = false;
      this.transferTokenAddress = '';
      this.transferTokenAmount = '';
    },
    async handleSubmitTransferToken() {
      const { data } = await sendMessageFromExtPageToBackground('getUnspents', {
        address: this.account.address,
        transferAddress: this.transferTokenAddress,
        transferAmount: this.transferTokenAmount,
        transferItem: this.transferTokenItem
      });
      this.handleCloseTransferTokenDialog();
      await this.fetchTokenInfo();
    },
  },
};
</script>
<style lang="less" scoped src="./style.less"></style>
