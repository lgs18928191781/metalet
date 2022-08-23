import config from '@/config';
import { ERR_CODE_ERR } from '@/constant/errCode';
import { makeMessageResponse, openTab } from '@/util/chromeUtil';
import { initDb } from '@/util/db';
import messageMethods from '@/lib/messageHandler';

// 初始化
global._service_type_ = 'background';
global.config = config;
global.window = global;
global.window.config = config;
initDb();
messageMethods.initApi();

// 插件加载
chrome.runtime.onInstalled.addListener((details) => {
  console.info('runtime installed', details);
  // 加载后打开popup页面
  if (config.env === 'development') {
    openTab('/popup.html');
  }
});

// 消息互通
chrome.runtime.onMessage.addListener(messageProcessor);

// 处理消息
async function messageProcessor(message, sender, sendResponse) {
  console.info('background service | message come', message, sender);
  const { type, clientId, time } = message;
  const funcId = `${clientId}_${type}_${time}`;
  sendResponse(funcId);
  responseOneMessage(message, sender, funcId);
}
// 单个消息处理与响应
async function responseOneMessage(message, sender, funcId) {
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
      },
      null,
      (err && err.code) || -1,
      (err && err.message) || ERR_CODE_ERR
    );
  }
  await chrome.runtime.sendMessage(finalResult);
}
