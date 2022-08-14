const externalObj = {
//   axios: 'axios',
};

module.exports = function getExternals(env) {
  if (env === 'development') {
    return {};
  }

  return externalObj;
};
