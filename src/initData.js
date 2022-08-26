import { sendMessageFromExtPageToBackground } from '@/util/chromeUtil';
import store from '@/store';

// 实例化界面前先初始化数据
export async function initData() {
  const { data: networkType} = await sendMessageFromExtPageToBackground('getNetwork');
  await store.dispatch('system/setNetworkType', networkType);
  const { data } = await sendMessageFromExtPageToBackground('getAccount');
  await store.dispatch('account/setAccountList', data);
  const lastAccount = localStorage.getItem('account');
  if (lastAccount && data.length) {
    const hasAccount = data.find((v) => v.xprv === lastAccount);
    if (hasAccount) {
      await store.dispatch('account/setCurrentAccount', hasAccount);
      await sendMessageFromExtPageToBackground('checkOrCreateMetaId', hasAccount);
    }
  }
}
