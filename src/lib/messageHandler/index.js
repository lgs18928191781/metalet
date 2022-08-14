import Mnemonic from 'mvc-lib/mnemonic';
import { Wallet, Api, API_NET, API_TARGET, mvc } from '@/lib/meta-contract';
import config from '@/config';

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

function createAccount(message) {
  const { mnemonicWords, derivationPath } = message.data;
  const mnemonicStr = mnemonicWords.join(' ');
  const mnemonic = Mnemonic.fromString();
  const HDPrivateKey = mnemonic.toHDPrivateKey().deriveChild(derivationPath);
  const privateKey = HDPrivateKey.deriveChild(0).deriveChild(0).privateKey;
  const address = privateKey.toAddress().toString();
  const wif = privateKey.toString();
  return {
    address,
    wif,
    mnemonicStr,
  };
}

async function getBalance(message) {
  const { wif } = message.data;
  const wallet = initWallet(wif);
  return await wallet.getBalance();
}

async function sendAmount(message) {
  const { amount, address, wif } = message.data;
  const wallet = initWallet(wif);
  return await wallet.send(address, amount, {
    dump: true,
  });
}

export default {
  initApi,
  initWallet,
  resetWallet,
  getMnemonicWords,
  createAccount,
  getBalance,
  sendAmount
};
