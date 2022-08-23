import Mnemonic from 'mvc-lib/mnemonic';
import { Api, API_NET, API_TARGET, mvc } from '@/lib/meta-contract';
import config from '@/config';
import { create, select, update } from '@/util/db';

const metaSvAuthorization = config.CONFIG_METASV_AUTHORIZATION;
const P2PKH_UNLOCK_SIZE = 1 + 1 + 71 + 1 + 33;
const P2PKH_DUST_AMOUNT = 1;
let mvcApi;
let feeb = config.CONFIG_TX_FEEB;

function initApi() {
  if (!mvcApi) {
    mvcApi = new Api(API_NET.MAIN, API_TARGET.MVC);
    mvcApi.authorize({
      authorization: metaSvAuthorization,
    });
  }
  return mvcApi;
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
  const address = privateKey.toAddress().toString();
  const wif = privateKey.toString();
  const xpub = HDPrivateKey.xpubkey;
  const xprv = HDPrivateKey.xprivkey;

  const hasOne = await select(xprv);
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
  const { address } = message.data;
  let { pendingBalance, balance } = await mvcApi.getBalance(address);
  return balance + pendingBalance;
}

async function getUnspents(message) {
  const { address } = message.data;
  return await mvcApi.getUnspents(address);
}

async function sendAmount(message) {
  const { sendAmount, sendAddress, wif, address } = message.data;
  const utxos = await mvcApi.getUnspents(address);
  const tx = new mvc.Transaction();
  const privateKeys = [];
  // add input
  utxos.forEach((utxo) => {
    tx.addInput(
      new mvc.Transaction.Input.PublicKeyHash({
        output: new mvc.Transaction.Output({
          script: mvc.Script.buildPublicKeyHashOut(new mvc.Address(address)),
          satoshis: utxo.satoshis,
        }),
        prevTxId: utxo.txId,
        outputIndex: utxo.outputIndex,
        script: mvc.Script.empty(),
      })
    );
    privateKeys.push(mvc.PrivateKey.fromString(wif));
  });
  // add output
  tx.addOutput(
    new mvc.Transaction.Output({
      script: new mvc.Script(new mvc.Address(sendAddress)),
      satoshis: sendAmount,
    })
  );
  // add change and fee
  const unlockSize = tx.inputs.filter((v) => v.output.script.isPublicKeyHashOut()).length * P2PKH_UNLOCK_SIZE;
  let fee = Math.ceil((tx.toBuffer().length + unlockSize + mvc.Transaction.CHANGE_OUTPUT_MAX_SIZE) * feeb);
  const fee2 = Math.ceil((utxos.length * 148 + 34 + 10) * feeb);
  console.log('fee', fee);
  console.log('fee2', fee2);
  fee = Math.max(fee, fee2);
  tx.fee(fee);
  tx.change(new mvc.Address(address));
  // unlock
  tx.sign(privateKeys);
  // broadcast
  return await mvcApi.broadcast(tx.serialize(true));
}

async function updateFeeb(message) {
  const { feeb: reqFeeb } = message.data;
  feeb = reqFeeb;
}

async function getFeeb(message) {
  return feeb;
}

async function countFee(message) {
  const { sendAmount, sendAddress, wif, address, unspents } = message.data;
  let utxos;
  if (unspents) {
    utxos = unspents;
  } else {
    utxos = await mvcApi.getUnspents(address);
  }
  const tx = new mvc.Transaction();
  const privateKeys = [];
  // add input
  utxos.forEach((utxo) => {
    tx.addInput(
      new mvc.Transaction.Input.PublicKeyHash({
        output: new mvc.Transaction.Output({
          script: mvc.Script.buildPublicKeyHashOut(new mvc.Address(address)),
          satoshis: utxo.satoshis,
        }),
        prevTxId: utxo.txId,
        outputIndex: utxo.outputIndex,
        script: mvc.Script.empty(),
      })
    );
    privateKeys.push(mvc.PrivateKey.fromString(wif));
  });
  // add output
  tx.addOutput(
    new mvc.Transaction.Output({
      script: new mvc.Script(new mvc.Address(sendAddress)),
      satoshis: sendAmount,
    })
  );
  // add change and fee
  const unlockSize = tx.inputs.filter((v) => v.output.script.isPublicKeyHashOut()).length * P2PKH_UNLOCK_SIZE;
  let fee = Math.ceil((tx.toBuffer().length + unlockSize + mvc.Transaction.CHANGE_OUTPUT_MAX_SIZE) * feeb);
  const fee2 = Math.ceil((utxos.length * 148 + 34 + 10) * feeb);
  console.log('fee', fee);
  console.log('fee2', fee2);
  fee = Math.max(fee, fee2);
  return fee;
}

async function getAccount(message) {
  const { xprv } = message.data || {};
  return await select(xprv || undefined);
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

  const hasOne = await select(obj.xprv);
  if (!hasOne) {
    await create(obj);
  }

  return obj;
}

async function updateAccount(message) {
  const { privateKey, password, alias } = message.data;
  const hasOne = await select(privateKey);
  if (!hasOne) {
    throw new Error('account is not exist');
  }
  const updateObj = {
    ...hasOne,
    password,
    alias,
  };
  await update(updateObj);
  return updateObj;
}

async function checkOrCreateMetaId(message) {
  const { address, wif, mnemonicStr, alias, password, xpub, xprv } = message;
}

export default {
  initApi,
  getMnemonicWords,
  createAccount,
  getBalance,
  sendAmount,
  getAccount,
  updateAccount,
  restoreAccount,
  updateFeeb,
  getFeeb,
  checkOrCreateMetaId,
  countFee,
  getUnspents,
};
