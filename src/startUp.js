import '@/style/normalize.less';
import '@/style/module.less';
import { computeHtmlFontSize, computeScreenSize } from '@/util';

computeScreenSize();
computeHtmlFontSize();
window.onresize = () => {
  computeHtmlFontSize();
  computeScreenSize();
};
