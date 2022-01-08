/**
 * 取得存储值
 * @param key
 * @param defaultValue
 * @returns {*}
 */
export const getValue = (key, defaultValue) => {
  return GM_getValue(key, defaultValue);
};

/**
 * 设置存储值
 * @param key
 * @param value
 */
export const setValue = (key, value) => {
  GM_setValue(key, value);
};
