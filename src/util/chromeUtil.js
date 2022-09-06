import { ERR_CODE_OK, ERR_CODE_UNKNOW, msgCodeMap } from '@/constant/errCode';

export function checkSenderFrom(sender) {
  if (!sender || !sender.url) {
    return 'unknow';
  }

  if (sender.url.indexOf('popup.html') > -1) {
    return 'popup';
  }
  if (sender.url.indexOf('options.html') > -1) {
    return 'options';
  }
}

export function makeMessageResponse(matchingData = { id: 0, from: 0 }, data = null, code = ERR_CODE_OK, msg) {
  if (code in msgCodeMap) {
    msg = msgCodeMap[code];
  } else {
    msg = msgCodeMap[ERR_CODE_UNKNOW];
  }
  const result = {
    data,
    code,
    msg,
    matchingData,
  };
  return result;
}

export function openTab(url, callback, otherParams = {}) {
  chrome?.tabs?.create({ ...otherParams, url }, function (tab) {
    if (typeof callback === 'function') callback(tab);
  });
}

export function initExtPageMessageListener() {
  if (!initExtPageMessageListener.msgMap) {
    initExtPageMessageListener.msgMap = {};
  }

  chrome?.runtime?.onMessage?.addListener((message, sender, sendResponse) => {
    console.info('ext page | message come', message, sender);
    try {
      if (!message) {
        throw new Error('no response message');
      }
      if (!message.matchingData) {
        throw new Error('no response matchingData');
      }
      const { matchingData } = message;
      const { funcId } = matchingData;
      if (
        funcId in initExtPageMessageListener.msgMap &&
        typeof initExtPageMessageListener.msgMap[funcId] === 'function'
      ) {
        initExtPageMessageListener.msgMap[funcId](message);
      }
    } catch (err) {
      console.error(err);
    }
    sendResponse();
  });
}

export function sendMessageFromExtPageToBackground(type, data = null) {
  return new Promise((resolve, reject) => {
    const clientId = window.name;
    const time = Date.now();
    if (chrome?.runtime?.sendMessage) {
      chrome?.runtime?.sendMessage({ type, data, clientId, time });
    } else {
      throw new Error('send message unSupport')
    }
    const funcId = `${clientId}_${type}_${time}`;

    initExtPageMessageListener.msgMap[funcId] = (finalResult) => {
      const { code, msg } = finalResult;
      if (code !== 0) {
        reject(finalResult);
        if (window && window.globalToast) {
          window.globalToast({
            message: msg,
          });
        }
      } else {
        resolve(finalResult);
      }
      initExtPageMessageListener.msgMap[funcId] = null;
      delete initExtPageMessageListener.msgMap[funcId];
    };
  });
}
