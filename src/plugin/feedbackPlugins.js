import { createApp } from 'vue';
import Toast from '@/component/module/Toast.vue';
import Loading from '@/component/module/Loading.vue';
import Alert from '@/component/module/Alert.vue';

// toast
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

// loading
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

// alert
export function globalAlert(options, el = document.body) {
  let isSent = false;
  return new Promise((resolve, reject) => {
    const {
      title = '',
      message = '',
      cancelBtn = false,
      onClose = undefined,
      onConfirm = undefined,
      onCancel = undefined,
      mask = true,
    } = options || {};
    const mountNode = document.createElement('DIV');
    el.append(mountNode);

    function closeMethod() {
      typeof onClose === 'function' && onClose();
      instance.unmount(mountNode);
      el.removeChild(mountNode);
      if (!isSent) {
        reject();
      }
    }

    function confirmMethod() {
      typeof onConfirm === 'function' && onConfirm();
      isSent = true;
      resolve();
      closeMethod();
    }

    function cancelMethod() {
      typeof onCancel === 'function' && onCancel();
      isSent = true;
      reject();
      closeMethod();
    }

    const instance = createApp(Alert, {
      title,
      message,
      cancelBtn,
      onClose: closeMethod,
      onConfirm: confirmMethod,
      onCancel: cancelMethod,
      mask,
    });
    instance.mount(mountNode);
  });
}

export const alert = {
  install(app) {
    app.config.globalProperties.$alert = globalAlert;
  },
};
window.globalAlert = globalAlert;
