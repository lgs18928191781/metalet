import '@/style/normalize.less';
import '@/style/module.less';
import { createApp } from 'vue';
import router from '@/router';
import store from '@/store';
import filter from '@/filter';
import i18n from '@/i18n';
import App from '@/App.vue';
import { initClientName, computeHtmlFontSize, computeScreenSize } from '@/util';
import { initExtPageMessageListener } from '@/./util/chromeUtil';
import { initDb } from '@/util/db';

async function beforeInit() {
  await initDb().catch((err) => {
    alert(i18n('error.indexDbNotSupport'));
  });
  initClientName();
  computeScreenSize();
  computeHtmlFontSize();
  window.onresize = () => {
    computeHtmlFontSize();
    computeScreenSize();
  };
}

export async function initApp() {
  await beforeInit();
  const app = createApp(App);
  app.use(filter);
  app.use(store);
  app.use(router);
  app.use(i18n);
  app.mount('#root');
  initExtPageMessageListener();
}
