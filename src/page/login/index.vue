<template>
  <div class="page-login">
    <div v-if="step === 0" class="step-0">
      <h1>
        {{ $t('login.welcome') }}
        <span>{{ $t('app') }}</span>
      </h1>
      <p>{{ $t('login.welcome_2') }}</p>
      <button class="mo-btn" @click="handleNextStep()">{{ $t('login.startNow') }}</button>
    </div>
    <div v-if="step === 1" class="step-1">
      <div class="mo-card">
        <h1 class="mo-title">{{ $t('login.createNewAccount') }}</h1>
        <p class="mo-text">{{ $t('login.desc') }}</p>
        <hr class="mo-divider" />
        <h2 class="mo-sub-title">{{ $t('login.mnemonic') }}:</h2>
        <p class="mo-text">{{ $t('login.desc_2') }}</p>
        <div class="word-list">
          <template v-for="(word, index) in mnemonicWords" :key="index">
            <span class="word">{{ word }}</span>
          </template>
        </div>
        <div class="change-word">
          <button class="mo-btn small" @click="getMnemonicWords">{{ $t('login.changeWord') }}</button>
        </div>
        <hr class="mo-divider" />
        <h2 class="mo-sub-title">{{ $t('login.fillInfo') }}:</h2>
        <div class="mo-form">
          <div class="form-item">
            <label class="form-item-label">{{ $t('login.derivationPath') }}</label>
            <div class="form-item-content">
              <input
                class="mo-input"
                type="text"
                disabled="disabled"
                :placeholder="$t('pleaseInput')"
                v-model="derivationPath"
              />
            </div>
          </div>
          <div class="form-item">
            <label class="form-item-label">{{ $t('login.password') }}</label>
            <div class="form-item-content">
              <input
                class="mo-input"
                type="password"
                :placeholder="$t('pleaseInput') + $t('optional')"
                v-model="password"
              />
            </div>
          </div>
          <div class="form-item">
            <label class="form-item-label">{{ $t('login.password_2') }}</label>
            <div class="form-item-content">
              <input
                class="mo-input"
                type="password"
                :placeholder="$t('pleaseInput') + $t('optional')"
                v-model="repeatPassword"
              />
            </div>
          </div>
          <div class="form-item">
            <label class="form-item-label">{{ $t('login.alias') }}</label>
            <div class="form-item-content">
              <input class="mo-input" type="text" :placeholder="$t('pleaseInput') + $t('optional')" v-model="alias" />
            </div>
          </div>
          <div class="form-item" style="text-align: center">
            <button class="mo-btn" @click="createAccount">{{ $t('login.submit') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import { sendMessageFromExtPageToBackground } from '@/util/chromeUtil';

export default {
  name: 'page-login',
  data() {
    return {
      step: 0, // welcome, mnemonic+password
      mnemonicWords: [],
      derivationPath: "m/44'/0'/0'",
      password: '',
      repeatPassword: '',
      alias: '',
    };
  },
  created() {
    this.getMnemonicWords();
  },
  methods: {
    ...mapActions('user', ['setUser']),
    handleNextStep() {
      this.step = 1;
    },
    async getMnemonicWords() {
      const { data } = await sendMessageFromExtPageToBackground('getMnemonicWords');
      this.mnemonicWords = data;
    },
    async createAccount() {
      const { data } = await sendMessageFromExtPageToBackground('createAccount', {
        mnemonicWords: this.mnemonicWords,
        derivationPath: this.derivationPath,
        alias: this.alias,
        password: this.password,
      });
      this.setUser(data);
      this.$router.replace({
        path: '/',
      });
    },
  },
};
</script>
<style lang="less" scoped>
.page-login {
  height: 100vh;
  height: var(--screenHeigth);
  display: flex;
  flex-direction: column;

  .step-0 {
    display: flex;
    flex-grow: 1;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    box-sizing: border-box;
    padding-bottom: 100px;

    h1 {
      font-size: 60px;
      font-weight: bolder;

      span {
        color: var(--primary-color);
      }
    }

    p {
      margin-top: 30px;
      text-align: center;
    }

    button {
      margin-top: 80px;
      width: 240px;
      height: 80px;
      line-height: 80px;
    }
  }

  .step-1 {
    box-sizing: border-box;
    padding: 36px;

    p {
      margin-top: 20px;
    }

    .mo-sub-title {
      margin-top: 30px;
    }

    .word-list {
      margin-top: 30px;
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
      margin-top: 30px;
    }
  }
}
</style>
