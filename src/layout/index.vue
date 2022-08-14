<template>
  <div class="layout">
    <div class="head-bar">
      <router-link to="/" class="logo">
        <img :src="appLogo" v-if="appLogo" />
        <span>{{ appName }}</span>
      </router-link>
      <div class="more">
        <img src="/img/icon-more.svg" />
      </div>
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
  width: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  .head-bar {
    width: 100%;
    height: 80px;
    background: var(--background-color);
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
        height: 50px;
        width: auto;
        margin-right: 10px;
      }

      span {
        color: var(--primary-text-color);
        font-size: 32px;
      }
    }

    .more {
      width: 50px;
      height: 50px;
      img {
        display: block;
        width: auto;
        height: 100%;
        filter: invert(1);
      }
    }
  }

  .main-content {
    box-sizing: border-box;
    margin: 80px 0 0 0;
    padding: 36px;
    position: relative;
    overflow: auto;
  }
}
</style>
