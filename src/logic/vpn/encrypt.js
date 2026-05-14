import * as aesHelper from './aes-helper.js';
import {getVpnCredentials} from '@/logic/vpn/credentials';

/**
 * 通用加密
 * @param data
 * @returns {string}
 */
export const parse = async (data) => {
  const credentials = await getVpnCredentials();
  return aesHelper.encrypt(data, credentials.key, credentials.iv);
};

/**
 * 通用解密
 * @param data
 * @returns {string|*}
 */
export const unparse = async (data) => {
  const credentials = await getVpnCredentials();
  return aesHelper.decrypt(data, credentials.key);
};
