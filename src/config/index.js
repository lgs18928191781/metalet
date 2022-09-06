const appConf = {
  env: process.env.env,
  mode: process.env.mode,
  version: process.env.version,
  networkType: 'main',
  ...process.env.appEnv,
};

export function changeNetworkType(val) {
  appConf.networkType = val;
}

export default appConf;
