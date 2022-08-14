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
  const d = new Decimal(satoshis);
  return d.div(100000000).toFixed(10);
}

export function createQrCode(text) {
  return qrcode.toDataURL(text);
}
