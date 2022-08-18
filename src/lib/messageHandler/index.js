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
  if (!mvcWallet) {
    mvcWallet = new Wallet(wif, API_NET.MAIN, Number(config.CONFIG_TX_FEEB) || 0.1, API_TARGET.MVC);
    mvcWallet.blockChainApi.authorize({
      authorization: metaSvAuthorization,
    });
  }
  return mvcWallet;
}

function resetWallet() {
  mvcWallet = undefined;
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
  const xpriv = HDPrivateKey.xprivkey;

  const hasOne = await select(wif);
  if (!hasOne) {
    await create({
      address,
      wif,
      mnemonicStr,
      alias,
      password,
      xpub,
      xpriv
    });
  }

  return {
    address,
    wif,
    mnemonicStr,
    alias,
    password,
    xpub,
    xpriv,
  };
}

async function getBalance(message) {
  const { wif } = message.data;
  const wallet = initWallet(wif);
  return await wallet.getBalance();
}

async function sendAmount(message) {
  const { sendAmount, sendAddress, wif, feeb = 0.5 } = message.data;
  const wallet = initWallet(wif);
  return await wallet.send(sendAddress, sendAmount, feeb, {
    dump: true,
  });
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
  const { mnemonicStr, derivationPath, restoreType, xpriv } = message.data;
  let obj;
  // 使用助记词恢复
  if (restoreType === 0) {
    const mnemonic = Mnemonic.fromString(mnemonicStr);
    const HDPrivateKey = mnemonic.toHDPrivateKey().deriveChild(derivationPath);
    const privateKey = HDPrivateKey.deriveChild(0).deriveChild(0).privateKey;
    const address = privateKey.toAddress().toString();
    const wif = privateKey.toString();
    const xpub = HDPrivateKey.xpubkey;
    const xpriv = HDPrivateKey.xprivkey;

    obj = {
      address,
      wif,
      mnemonicStr,
      alias: null,
      password: null,
      xpub,
      xpriv
    };
  }
  // 使用私钥恢复
  if (restoreType === 1) {
    const HDPrivateKey = mvc.HDPrivateKey.fromString(xpriv)
    const privateKey = HDPrivateKey.deriveChild(0).deriveChild(0).privateKey; // 0/0地址
    const publicKey = HDPrivateKey.deriveChild(0).deriveChild(0).publicKey; // 0/0地址
    const address = privateKey.toAddress().toString();
    const wif = privateKey.toString();
    const xpub = HDPrivateKey.xpubkey;
    const xpriv = HDPrivateKey.xprivkey;

    obj = {
      address,
      wif,
      mnemonicStr: null,
      alias: null,
      password: null,
      xpub,
      xpriv
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
};
