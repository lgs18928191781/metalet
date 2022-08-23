import config from '@/config';
import { get } from '@/util/request';

export function getExchangeRate() {
  return get({
    url: '/wxcore/legalbsv/getExchangeRate',
    host: config.CONFIG_API_HOST2,
  });
}
