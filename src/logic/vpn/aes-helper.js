import aesjs from 'aes-js';

const Utf8 = aesjs.utils.utf8;
const Hex = aesjs.utils.hex;
const ModeCfb = aesjs.ModeOfOperation.cfb;

const padData = (data, mode = "utf8") => {
  const len = "utf8" === mode ? 16 : 32;
  if (data.length % len === 0) return data;
  let e = len - (data.length % len), r = 0;
  for (; r++ < e;)
    data += "0";
  return data;
};

/**
 * AES-CFB 加密
 * @param data
 * @param key
 * @param iv
 * @returns {string}
 */
export const encrypt = (data, key, iv) => {
  const len = data.length;
  data = padData(data, "utf8");
  const hexKey = Utf8.toBytes(key),
    hexIv = Utf8.toBytes(iv),
    hexData = Utf8.toBytes(data),
    hexRet = new ModeCfb(hexKey, hexIv, 16).encrypt(hexData);
  return Hex.fromBytes(hexIv) + Hex.fromBytes(hexRet).slice(0, 2 * len);
};

/**
 * AES-CFB 解密
 * @param data
 * @param key
 * @returns {string|*}
 */
export const decrypt = (data, key) => {
  try {
    const len = (data.length - 32) / 2;
    data = padData(data, "hex");
    const hexKey = Utf8.toBytes(key),
      hexIv = Hex.toBytes(data.slice(0, 32)),
      hexData = Hex.toBytes(data.slice(32)),
      hexRet = new ModeCfb(hexKey, hexIv, 16).decrypt(hexData);
    return Utf8.fromBytes(hexRet).slice(0, len);
  } catch (i) {
    return data;
  }
};
