import * as aesHelper from './aes-helper.js';
import {vpnCryptIv, vpnCryptKey} from "@/logic/config";

/**
 * 通用加密
 * @param data
 * @returns {string}
 */
export const parse = (data) => {
  return aesHelper.encrypt(data, vpnCryptKey, vpnCryptIv);
};

/**
 * 通用解密
 * @param data
 * @returns {string|*}
 */
export const unparse = (data) => {
  return aesHelper.decrypt(data, vpnCryptKey);
};
