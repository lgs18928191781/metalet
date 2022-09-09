import config, { changeNetworkType } from '@/config';
import { ERR_CODE_ERR } from '@/constant/errCode';
import { makeMessageResponse, openTab } from '@/util/chromeUtil';
import { initDb } from '@/util/db';
import * as messageMethods from '@/lib/messageHandler';
import { checkNetwork } from '@/util';

// 初始化
global._isReady = false;
global._service_type_ = 'background';
global.config = config;
global.window = global;
global.window.config = config;
initDb();
messageMethods.initApi();

// 插件加载
chrome.runtime.onInstalled.addListener((details) => {
  console.info('runtime installed', details);
  checkNetwork()
    .then(async (res) => {
      await changeNetworkType(res);
    })
    .finally(() => {
      // 加载后打开popup页面
      if (config.env === 'development') {
        openTab('/popup.html');
      }
      global._isReady = true;
    });
});

// 消息互通
chrome.runtime.onMessage.addListener(messageProcessor);

// 处理消息
async function messageProcessor(message, sender, sendResponse) {
  const { type, clientId, time, from, to } = message;
  if (to !== 'background') {
    // ignore
    return;
  }
  console.info('background service | message come', message, sender);
  const funcId = `${clientId}_${type}_${time}`;

  // extpage与background通信
  if (to === 'background' && from === 'extPage') {
    sendResponse(funcId);
    responseOneMessage(message, sender, funcId, 'extPage');
  }

  // contentScript与background通信
  if (to === 'background' && from === 'contentScript') {
    sendResponse(funcId);
    responseOneMessage(message, sender, funcId, 'contentScript');
  }
}

// 单个消息处理与响应
async function responseOneMessage(message, sender, funcId, fromType) {
  const { type, clientId, time } = message;
  let func;
  if (messageMethods[message.type]) {
    func = messageMethods[message.type];
  }

  if (typeof func !== 'function') {
    return;
  }

  let finalResult;
  try {
    const res = await func(message, sender);
    finalResult = makeMessageResponse(
      {
        type,
        clientId,
        time,
        funcId,
        from: 'background',
        to: fromType,
      },
      res
    );
  } catch (err) {
    console.error(err);
    finalResult = makeMessageResponse(
      {
        type,
        clientId,
        time,
        funcId,
        from: 'background',
        to: fromType,
      },
      null,
      (err && err.code) || -1,
      (err && err.message) || ERR_CODE_ERR
    );
  }
  // from extPage
  if (fromType === 'extPage') {
    await chrome.runtime.sendMessage(finalResult);
  }
  // from contentScript
  else if (fromType === 'contentScript') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, finalResult);
      }
    });
  }
}
