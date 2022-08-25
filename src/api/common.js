import config from '@/config';
import { get, post } from '@/util/request';

export function getExchangeRate() {
  return get({
    url: '/wxcore/legalbsv/getExchangeRate',
    host: config.CONFIG_API_SHOWMONEY_HOST_TEST,
  });
}

export function getMetaIdByZeroAddress(data) {
  return post({
    url: '/serviceapi/api/v1/metago/getMetaIdByZoreAddress',
    host: config.CONFIG_API_SHOWMONEY_HOST_TEST,
    data,
  });
}

export function getShowDIDUserInfo(data) {
  return post({
    url: '/serviceapi/api/v1/metago/getShowDIDUserInfo',
    host: config.CONFIG_API_SHOWMONEY_HOST_TEST,
    data,
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

export function getAddressBalance(address) {
  return get({
    url: `/address/${address}/balance`,
    host: config.CONFIG_API_HOST,
  });
}
