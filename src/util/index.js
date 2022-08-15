import { v4 as uuid } from 'uuid';
import config from '@/config';
import dayjs from 'dayjs';
import { Decimal } from 'decimal.js';
import qrcode from 'qrcode';

export function initClientName() {
  window.name = `${config.CONFIG_APP_NAME}_${uuid()}`;
}

export function formateDate(val, fmt = 'YYYY-MM-DD HH:mm:ss') {
  if (!val) {
    return '';
  }
  return dayjs(val).format(fmt);
}

export function computeScreenSize() {
  let body = document.querySelector('body');
  let html = document.querySelector('html');
  let rootStyle = document.querySelector('#root-style');
  let root = document.querySelector('#root');
  const div = document.createElement('DIV');
  div.setAttribute(
    'style',
    'position: fixed;width: 100%;height: 100%;z-index: -1;top: 0;left: 0;pointer-events: none;'
  );
  body.appendChild(div);
  const height = div.getBoundingClientRect().height;
  const htmlHeight = html.clientHeight;
  const bodyHeight = body.clientHeight;
  if (height === 600 && height === htmlHeight && height === bodyHeight) {
    setTimeout(() => {
      root.style.height = height + 'px';
      root.style.overflowX = 'hidden';
      root.style.overflowY = 'auto';
    }, 0);
  }
  div.remove();

  if (!rootStyle) {
    const style = document.createElement('STYLE');
    style.setAttribute('id', 'root-style');
    style.innerHTML = `:root {--screenHeight: ${height}px;}`;
    body.appendChild(style);
  }
}

export function computeHtmlFontSize() {
  let screenWidth = Math.min(window.innerWidth, 1000);
  let html = document.querySelector('html');
  let body = document.querySelector('body');
  if (screenWidth >= 1000) {
    html.style.fontSize = '100px';
    body.style.fontSize = '16px';
  } else {
    let fontSize = (screenWidth / 750) * 100;
    html.style.fontSize = fontSize + 'px';
    body.style.fontSize = 0.32 + 'rem';
  }
}

export function getStorageSession() {
  const storageStr = localStorage.getItem('session') || null;
  if (!storageStr) {
    return {};
  }
  try {
    return JSON.parse(storageStr);
  } catch (err) {
    return {};
  }
}

export function setStorageSession(val) {
  let valStr = JSON.stringify(val);
  if (!val) {
    localStorage.removeItem('session');
    return;
  }
  localStorage.setItem('session', valStr);
}

export function getNavigatorLanguage() {
  const lang = ((navigator.language ? navigator.language : navigator.userLanguage) || 'en').toLowerCase();
  return lang.split('-')[0];
}

export function getStorageLanguage() {
  return localStorage.getItem('lang');
}

export function setStorageLanguage(va) {
  localStorage.setItem('lang', val);
}

export function satoshisToBSV(satoshis) {
  if (!satoshis || satoshis <= 0) {
    return 0;
  }
  const d = new Decimal(satoshis);
  return d.div(100000000).toFixed(10);
}

export function satoshisToLcy(satoshis, rate) {
  if (!satoshis || satoshis <= 0 || !rate) {
    return 0;
  }
  const d = new Decimal(satoshis);
  return d.div(100000000).mul(rate).toFixed(10);
}

export function createQrCode(text) {
  return qrcode.toDataURL(text, {
    margin: 0,
    errorCorrectionLevel: 'H',
    width: 200,
  });
}
