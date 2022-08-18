import { createApp } from 'vue';
import Toast from '@/component/module/Toast.vue';
import Loading from '@/component/module/Loading.vue';

export function globalToast(options, el = document.body) {
  const { type = '', message = '', duration = 2500, onClose = undefined } = options || {};
  const mountNode = document.createElement('DIV');
  el.append(mountNode);
  function closeMethod() {
    typeof onClose === 'function' && onClose();
    instance.unmount(mountNode);
    el.removeChild(mountNode);
  }
  const instance = createApp(Toast, {
    type,
    message,
    duration,
    onClose: closeMethod,
  });
  instance.mount(mountNode);

  return {
    instance,
    close: closeMethod,
  };
}
export const toast = {
  install(app) {
    app.config.globalProperties.$toast = globalToast;
  },
};
window.globalToast = globalToast;

export function globalLoading(options, el = document.body) {
  const { type = '', message = 'Loading...', duration = 0, onClose = undefined, mask = true } = options || {};
  const mountNode = document.createElement('DIV');
  el.append(mountNode);
  function closeMethod() {
    typeof onClose === 'function' && onClose();
    instance.unmount(mountNode);
    el.removeChild(mountNode);
  }
  const instance = createApp(Loading, {
    type,
    message,
    duration,
    onClose: closeMethod,
    mask,
  });
  instance.mount(mountNode);

  return {
    instance,
    close: closeMethod,
  };
}
export const loading = {
  install(app) {
    app.config.globalProperties.$loading = globalLoading;
  },
};
window.globalLoading = globalLoading;
