<template>
  <div class="page-account">
    <mo-tab around v-model="curTab" :list="tabList" />
    <!-- 创建 -->
    <template v-if="curTab === 0">
      <mo-card class="account-card">
        <p class="mo-text">{{ $t('account.desc') }}</p>
      </mo-card>
      <mo-card>
        <h2 class="mo-sub-title">{{ $t('account.mnemonic') }}:</h2>
        <p class="mo-text">{{ $t('account.desc_2') }}</p>
        <div class="word-list">
          <template v-for="(word, index) in mnemonicWords" :key="index">
            <span class="word">{{ word }}</span>
          </template>
        </div>
        <div class="change-word">
          <mo-button @click="getMnemonicWords">{{ $t('account.changeWord') }}</mo-button>
        </div>
      </mo-card>
      <mo-card>
        <h2 class="mo-sub-title">{{ $t('account.fillInfo') }}:</h2>
        <mo-form>
          <mo-form-item :label="$t('account.derivationPath')">
            <mo-input disabled="disabled" v-model="derivationPath" />
          </mo-form-item>
          <mo-form-item :label="$t('account.password')">
            <mo-input type="password" :placeholder="$t('pleaseInput') + $t('optional')" v-model="password" />
          </mo-form-item>
          <mo-form-item :label="$t('account.password_2')">
            <mo-input type="password" :placeholder="$t('pleaseInput') + $t('optional')" v-model="repeatPassword" />
          </mo-form-item>
          <mo-form-item :label="$t('account.alias')">
            <mo-input :placeholder="$t('pleaseInput') + $t('optional')" v-model="alias" />
          </mo-form-item>
          <mo-form-item submitItem style="text-align: center">
            <mo-button @click="createAccount">{{ $t('submit') }}</mo-button>
          </mo-form-item>
        </mo-form>
      </mo-card>
    </template>
    <!-- 恢复 -->
    <template v-if="curTab === 1">
      <mo-card class="account-card">
        <p class="mo-text">{{ $t('account.desc_5') }}</p>
      </mo-card>
      <mo-card>
        <h2 class="mo-sub-title">{{ $t('account.restoreType') }}:</h2>
        <mo-radio-group :inline="false" :list="restoreList" v-model="restoreType" />
      </mo-card>
      <mo-card>
        <h2 class="mo-sub-title">{{ $t('account.fillInfo') }}:</h2>
        <mo-form>
          <template v-if="restoreType === 0">
            <mo-form-item :label="$t('account.mnemonic')">
              <mo-input v-model="mnemonicStr" />
            </mo-form-item>
            <mo-form-item :label="$t('account.derivationPath')">
              <mo-input v-model="derivationPath" />
            </mo-form-item>
          </template>
          <template v-if="restoreType === 1">
            <mo-form-item :label="$t('account.privateKey')">
              <mo-input v-model="privateKey" />
            </mo-form-item>
          </template>
          <mo-form-item submitItem style="text-align: center">
            <mo-button @click="restoreAccount">{{ $t('submit') }}</mo-button>
          </mo-form-item>
        </mo-form>
      </mo-card>
    </template>
  </div>
</template>
<script>
import i18n from '@/i18n';
import { mapActions } from 'vuex';
import { sendMessageFromExtPageToBackground } from '@/util/chromeUtil';
import MoFormItem from '@/component/module/FormItem';

export default {
  name: 'page-account',
  components: { MoFormItem },
  data() {
    return {
      curTab: +this.$route.query.tab || 0,
      tabList: [
        { name: 0, label: i18n('account.createNewAccount') },
        { name: 1, label: i18n('account.restoreAccount') },
      ],
      mnemonicWords: [],
      mnemonicStr: '',
      privateKey: '',
      derivationPath: "m/44'/10001'/0'",
      password: '',
      repeatPassword: '',
      alias: '',
      restoreType: 0,
      restoreList: [
        {
          label: i18n('account.restoreType_1'),
          name: 0,
        },
        {
          label: i18n('account.restoreType_2'),
          name: 1,
        },
      ],
    };
  },
  created() {
    this.getMnemonicWords();
  },
  methods: {
    ...mapActions('account', ['setCurrentAccount']),
    async getMnemonicWords() {
      const { data } = await sendMessageFromExtPageToBackground('getMnemonicWords');
      this.mnemonicWords = data;
    },
    async createAccount() {
      const { data } = await sendMessageFromExtPageToBackground('createAccount', {
        mnemonicWords: this.mnemonicWords.join(' '),
        derivationPath: this.derivationPath,
        alias: this.alias,
        password: this.password,
      });
      this.setCurrentAccount(data);
      this.$router.replace({
        path: '/',
      });
    },
    async restoreAccount() {
      const { data } = await sendMessageFromExtPageToBackground('restoreAccount', {
        mnemonicStr: this.mnemonicStr,
        derivationPath: this.derivationPath,
        xpriv: this.privateKey,
        restoreType: this.restoreType,
      });
      this.setCurrentAccount(data);
      this.$router.replace({
        path: '/',
      });
    },
  },
};
</script>
<style lang="less" scoped>
.page-account {
  box-sizing: border-box;
  padding: 36px;

  .account-card {
    margin-top: 20px;
  }

  p {
    margin-top: 20px;

    &:first-child {
      margin-top: 0;
    }
  }

  .word-list {
    margin-top: 20px;
    font-size: 0;

    .word {
      display: inline-block;
      font-size: 28px;
      padding: 8px 18px;
      //background-color: var(--primary-color);
      color: var(--primary-color);
      border: 1px solid var(--primary-color);
      border-radius: 46px;
      margin: 0 20px 20px 0;
    }
  }

  .change-word {
    text-align: center;
    margin-top: 30px;
  }

  .mo-form {
    margin-top: 20px;
  }

  .mo-radio-group {
    margin-top: 20px;
  }
}
</style>
