import Mnemonic from 'mvc-lib/mnemonic';
import { Wallet, Api, API_NET, API_TARGET, mvc } from '@/lib/meta-contract';
import config from '@/config';
import { create, select } from '@/util/db';

const metaSvAuthorization = config.CONFIG_METASV_AUTHORIZATION;

let mvcWallet, mvcApi;

function initApi() {
  if (!mvcApi) {
    mvcApi = new Api(API_NET.MAIN, API_TARGET.MVC);
    mvcApi.authorize({
      authorization: metaSvAuthorization,
    });
  }
  return mvcApi;
}

function initWallet(wif) {
  if (!mvcWallet || wif !== mvcWallet.privateKey.toString()) {
    mvcWallet = new Wallet(wif, API_NET.MAIN, Number(config.CONFIG_TX_FEEB) || 0.1, API_TARGET.MVC);
    mvcWallet.blockChainApi.authorize({
      authorization: metaSvAuthorization,
    });
  }
  console.log(mvcWallet.privateKey.toString());
  return mvcWallet;
}

async function resetWallet(message) {
  const { wif } = message.data || {};
  if (wif) {
    initWallet(wif);
  } else {
    mvcWallet = undefined;
  }
}

function getMnemonicWords() {
  const mnemonic = Mnemonic.fromRandom();
  return mnemonic.toString().split(' ');
}

async function createAccount(message) {
  const { mnemonicStr, derivationPath, alias, password } = message.data;
  const mnemonic = Mnemonic.fromString(mnemonicStr);
  const HDPrivateKey = mnemonic.toHDPrivateKey().deriveChild(derivationPath);
  const privateKey = HDPrivateKey.deriveChild(0).deriveChild(0).privateKey; // 0/0地址
  const publicKey = HDPrivateKey.deriveChild(0).deriveChild(0).publicKey; // 0/0地址
  const address = privateKey.toAddress().toString();
  const wif = privateKey.toString();
  const xpub = HDPrivateKey.xpubkey;
  const xprv = HDPrivateKey.xprivkey;

  const hasOne = await select(wif);
  if (!hasOne) {
    await create({
      address,
      wif,
      mnemonicStr,
      alias,
      password,
      xpub,
      xprv,
    });
  }

  return {
    address,
    wif,
    mnemonicStr,
    alias,
    password,
    xpub,
    xprv,
  };
}

async function getBalance(message) {
  const { wif } = message.data;
  const wallet = initWallet(wif);
  return await wallet.getBalance();
}

async function sendAmount(message) {
  const { sendAmount, sendAddress, wif } = message.data;
  const wallet = initWallet(wif);
  return await wallet.send(sendAddress, sendAmount, {
    dump: true,
  });
}

async function changeFeeb(message) {
  const { feeb, wif } = message.data;
  const wallet = initWallet(wif);
  wallet.feeb = feeb;
}

async function getFeeb(message) {
  const { wif } = message.data;
  const wallet = initWallet(wif);
  return wallet.feeb;
}

// TODO
async function countFee(message) {
  const { sendAmount, wif, feeb = 0.5 } = message.data;
  const wallet = initWallet(wif);
}

async function getAccount(message) {
  const { wif } = message.data || {};
  return await select(wif || undefined);
}

async function restoreAccount(message) {
  const { mnemonicStr, derivationPath, restoreType, privateKey: restorePrivateKey } = message.data;
  let obj;
  // 使用助记词恢复
  if (restoreType === 0) {
    const mnemonic = Mnemonic.fromString(mnemonicStr);
    const HDPrivateKey = mnemonic.toHDPrivateKey().deriveChild(derivationPath);
    const privateKey = HDPrivateKey.deriveChild(0).deriveChild(0).privateKey;
    const address = privateKey.toAddress().toString();
    const wif = privateKey.toString();
    const xpub = HDPrivateKey.xpubkey;
    const xprv = HDPrivateKey.xprivkey;

    obj = {
      address,
      wif,
      mnemonicStr,
      alias: null,
      password: null,
      xpub,
      xprv,
    };
  }
  // 使用私钥恢复
  if (restoreType === 1) {
    const HDPrivateKey = mvc.HDPrivateKey.fromString(restorePrivateKey);
    const privateKey = HDPrivateKey.deriveChild(0).deriveChild(0).privateKey;
    const wif = privateKey.toString();
    const address = privateKey.toAddress().toString();
    const xpub = HDPrivateKey.xpubkey;
    const xprv = HDPrivateKey.xprivkey;

    obj = {
      address,
      wif,
      mnemonicStr: null,
      alias: null,
      password: null,
      xpub,
      xprv,
    };
  }

  const hasOne = await select(obj.wif);
  if (!hasOne) {
    await create(obj);
  }

  return obj;
}

export default {
  initApi,
  initWallet,
  resetWallet,
  getMnemonicWords,
  createAccount,
  getBalance,
  sendAmount,
  getAccount,
  restoreAccount,
  changeFeeb,
  getFeeb
};
