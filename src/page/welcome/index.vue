<template>
  <div class="page-login">
    <h1>
      {{ $t('login.welcome') }}
      <span>{{ $t('app') }}</span>
    </h1>
    <p>{{ $t('login.welcome_2') }}</p>
    <mo-button @click="handleNextStep()">{{ $t('login.startNow') }}</mo-button>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'page-login',
  data() {
    return {};
  },
  computed: {
    ...mapGetters('account', ['currentAccount']),
  },
  methods: {
    handleNextStep() {
      this.$router.push({
        path: this.currentAccount ? '/' : '/account',
      });
    },
  },
};
</script>
<style lang="less" scoped>
.page-login {
  width: 100%;
  height: 100vh;
  height: var(--screenHeight);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;

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
</style>
