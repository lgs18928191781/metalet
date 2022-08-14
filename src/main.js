import '@/style/normalize.less';
import '@/style/module.less';
import { createApp } from 'vue';
import router from '@/router';
import store from '@/store';
import filter from '@/filter';
import i18n from '@/i18n';
import App from '@/App.vue';
import { initClientName, computeHtmlFontSize } from '@/util';
import { initExtPageMessageListener } from '@/./util/chromeUtil';

function beforeInit() {
  initClientName();
  computeHtmlFontSize();
  window.onresize = computeHtmlFontSize;
}

export function initApp() {
  beforeInit();
  const app = createApp(App);
  app.use(filter);
  app.use(store);
  app.use(router);
  app.use(i18n);
  app.mount('#root');
  initExtPageMessageListener();
}
