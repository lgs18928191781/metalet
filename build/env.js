const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// 读取.env配置文件
module.exports = function readDotEnv(env) {
  let filePath = path.resolve(__dirname, '../env/.env.' + env);
  if (!fs.existsSync(filePath)) {
    filePath = path.resolve(__dirname, '../env/.env.production');
  }

  return dotenv.config({
    path: filePath,
    override: true,
  }).parsed;
};
