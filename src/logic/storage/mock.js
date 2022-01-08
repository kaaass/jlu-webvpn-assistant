const GLOBAL_STORAGE = new Map();

window.globalStorage = GLOBAL_STORAGE;

/**
 * 取得存储值
 * @param key
 * @param defaultValue
 * @returns {*}
 */
export const getValue = (key, defaultValue) => {
  if (GLOBAL_STORAGE.has(key)) {
    return GLOBAL_STORAGE.get(key);
  }
  return defaultValue;
};

/**
 * 设置存储值
 * @param key
 * @param value
 */
export const setValue = (key, value) => {
  GLOBAL_STORAGE.set(key, value);
};
