<template>
  <div class="layout">
    <div class="head-bar">
      <router-link to="/" class="logo">
        <img :src="appLogo" v-if="appLogo" />
      </router-link>
    </div>
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'layout',
  computed: {
    ...mapGetters('system', ['config']),
    ...mapGetters('user', ['user']),
    appLogo() {
      return this.config?.CONFIG_APP_LOGO || '';
    },
    appName() {
      return this.config?.CONFIG_APP_NAME || '';
    },
  },
  methods: {
    ...mapActions({
      setSession: 'system/setSession',
      setUser: 'user/setUser',
    }),
  },
};
</script>
<style lang="less" scoped>
.layout {
  .head-bar {
    width: 100%;
    height: 60px;
    background: var(--primary-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    color: #fff;
    padding: 0 20px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 20;

    .logo {
      font-weight: 500;
      display: inline-flex;
      align-items: center;

      img {
        display: block;
        height: 40px;
        width: auto;
        margin-right: 10px;
      }

      span {
        color: #fff;
        font-size: 20px;
      }
    }
  }

  .main-content {
    box-sizing: border-box;
    margin: 60px 0 0 0;
    padding: 20px;
    position: relative;
  }
}
</style>
