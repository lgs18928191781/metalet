/**
 * 在Chrome extensions v3下,不支持eval函数,而i18n却是使用eval进行转换
 * */
import store from '@/store';
import langEn from './en';
import langZh from './zh';

const langCollection = {
  en: langEn,
  zh: langZh,
};

function getLangMessage(steps, lang = store.state.system.locale) {
  if (!steps) {
    return '';
  }
  const target = langCollection[lang];
  const stepArr = steps.split('.');
  let stepObj = target;
  while (stepArr.length) {
    const key = stepArr.shift();
    if (key in stepObj) {
      stepObj = stepObj[key];
    }
  }
  return typeof stepObj === 'string' ? stepObj : steps;
}

function i18n(steps, lang = store.state.system.locale) {
  return getLangMessage(steps, lang);
}
i18n.install = (app) => {
  app.config.globalProperties.$t = getLangMessage;
};

export default i18n;
