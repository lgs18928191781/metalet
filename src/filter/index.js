import * as filters from './functions';

export default {
  install: (app) => {
    app.config.globalProperties.$filter = filters;
  },
};
