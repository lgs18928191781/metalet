import config from '@/config';
import { get, post } from '@/util/request';

export function getExchangeRate() {
  return get({
    url: '/wxcore/legalbsv/getExchangeRate',
    host: config.networkType === 'test' ? config.CONFIG_API_SHOWMONEY_HOST_TEST : config.CONFIG_API_SHOWMONEY_HOST,
  });
}

export function getMetaIdByZeroAddress(zeroAddress) {
  return get({
    url: `/metaid-base/v1/meta/root/${zeroAddress}`,
    host: config.networkType === 'test' ? config.CONFIG_API_SHOWMONEY_HOST_TEST : config.CONFIG_API_SHOWMONEY_HOST,
  });
}

export function getShowDIDUserInfo(rootTxId) {
  return get({
    url: `/metaid-base/v1/meta/user/${rootTxId}`,
    host: config.networkType === 'test' ? config.CONFIG_API_SHOWMONEY_HOST_TEST : config.CONFIG_API_SHOWMONEY_HOST,
  });
}

export function getInitSat(data) {
  return get({
    url: '/getInitSat',
    host: 'http://127.0.0.1:9999',
    params: data,
  });
}

export function getAddressUtxo(address) {
  return get({
    url: `/address/${address}/utxo`,
    host: config.CONFIG_API_HOST,
  });
}

export function getTxIdRaw(txid) {
  return get({
    url: `/tx/${txid}/raw`,
    host: config.CONFIG_API_HOST,
  });
}

export function uploadMetaIdRaw(data) {
  return post({
    url: `/metaid-base/v1/meta/upload/raw`,
    host: config.networkType === 'test' ? config.CONFIG_API_SHOWMONEY_HOST_TEST : config.CONFIG_API_SHOWMONEY_HOST,
    data
  });
}
