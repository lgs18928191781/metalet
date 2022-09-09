const appConf = {
  env: process.env.env,
  mode: process.env.mode,
  version: process.env.version,
  networkType: 'test',
  ...process.env.appEnv,
};

export async function changeNetworkType(val) {
  return new Promise((resolve) => {
    let isOk = false;
    appConf.networkType = val;
    chrome.storage.sync.set(
      {
        networkType: val,
      },
      () => {
        isOk = true;
        resolve();
      }
    );
    setTimeout(() => {
      if (!isOk) resolve();
    }, 2000);
  });
}

export default appConf;
