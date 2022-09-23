import { storageSet } from '@/util/chromeUtil';

const appConf = {
  env: process.env.env,
  mode: process.env.mode,
  version: process.env.version,
  networkType: 'test',
  ...process.env.appEnv,
};

export async function changeNetworkType(val) {
  appConf.networkType = val;
  if (chrome?.storage?.sync?.set) {
    await storageSet('networkType', val);
  }
}

export default appConf;
