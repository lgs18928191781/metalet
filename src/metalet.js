import { v4 as uuid } from 'uuid';
import { ERR_CODE_OK, ERR_CODE_UNKNOW, msgCodeMap } from '@/constant/errCode';

export function makeMessageResponse(matchingData = {}, data = null, code = ERR_CODE_OK, msg) {
  if (code in msgCodeMap) {
    msg = msgCodeMap[code];
  } else {
    msg = msgCodeMap[ERR_CODE_UNKNOW];
  }
  const result = {
    data,
    code,
    msg,
    matchingData,
  };
  return result;
}

class Metalet {
  clientId = `injectClient-${uuid()}`;
  msgMap = {};

  constructor() {
    this.initMessageListener();
  }

  initMessageListener() {
    if (!this.msgMap) {
      this.msgMap = {};
    }
    window.addEventListener('message', (e) => {
      try {
        if (!e || !e.data || !e.data.matchingData) {
          return;
        }
        if (e.data.matchingData.to !== 'injectClient' || e.data.matchingData.from !== 'contentScript') {
          return;
        }
        const { matchingData } = e.data;
        const { funcId } = matchingData;
        if (funcId in this.msgMap && typeof this.msgMap[funcId] === 'function') {
          this.msgMap[funcId](e.data);
        }
      } catch (err) {
        console.error(err);
      }
    });
  }

  sendMessage(type, data = null, from = 'injectClient', to = 'contentScript') {
    return new Promise((resolve, reject) => {
      const clientId = this.clientId;
      const time = Date.now();
      if (window?.postMessage) {
        window.postMessage({ type, data, clientId, time, from, to }, location.origin);
      } else {
        throw new Error('send message unSupport');
      }
      const funcId = `${clientId}_${type}_${time}`;
      this.msgMap[funcId] = (finalResult) => {
        const { code, msg } = finalResult;
        if (code !== 0) {
          reject(finalResult);
        } else {
          resolve(finalResult);
        }
        this.msgMap[funcId] = null;
        delete this.msgMap[funcId];
      };
    });
  }

  async getAccount() {
    const res = await this.sendMessage('getCurrentAccount');
    return res.data;
  }

  async checkLogin() {
    const currentAccount = await this.getAccount().catch(() => false);
    if (!currentAccount) {
      return false;
    }
    return true;
  }

  async getBalance(address) {
    if (address) {
      return this.sendMessage('getBalance', { address });
    }
    const currentAccount = await this.getAccount();
    const res = await this.sendMessage('getBalance', { address: currentAccount.address });
    return res.data;
  }

  async getAddress() {
    const currentAccount = await this.getAccount();
    return currentAccount.address;
  }

  async connectWallet() {
    const res = await this.getPluginInfo('connectWallet');
    const pluginId = res.id;
    const url = `chrome-extension://${pluginId}/popup.html#/test`;
  }

  async getPluginInfo() {
    const res = await this.sendMessage('getPluginInfo');
    return res.data;
  }

  async getPublicKey() {
    const currentAccount = await this.getAccount();
    return currentAccount.publicKey;
  }
}

window.Metalet = Metalet;
window.metalet = new Metalet();
