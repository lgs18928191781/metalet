import '@/style/normalize.less';
import '@/style/module.less';
import { createApp } from 'vue';
import router from '@/router';
import store from '@/store';
import filter from '@/filter';
import { initPlugin } from '@/plugin';
import i18n from '@/i18n';
import App from '@/App.vue';
import { initClientName, computeHtmlFontSize, computeScreenSize } from '@/util';
import { initExtPageMessageListener } from '@/util/chromeUtil';
import { initData } from '@/initData';

// 加载vue app
export function loadApp(type) {
  // 初始化环境
  window._service_type_ = type;
  initExtPageMessageListener();
  initClientName();
  computeScreenSize();
  computeHtmlFontSize();
  window.onresize = () => {
    computeHtmlFontSize();
    computeScreenSize();
  };

  // 初始化数据
  initData(() => {
    // 挂载app
    const app = createApp(App);
    initPlugin(app);
    app.use(filter);
    app.use(store);
    app.use(router);
    app.use(i18n);
    app.mount('#root');
  });
}
