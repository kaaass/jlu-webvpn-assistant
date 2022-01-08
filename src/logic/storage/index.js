import {isDev} from "@/config";
import * as mock from "./mock";
import * as actual from "./actual";

let selected = actual;
// 开发环境启用 Mock
if (isDev) {
  selected = mock;
}

export const getValue = selected.getValue;

export const setValue = selected.setValue;

/**
 * 设置存储的对象
 * @param key
 * @param obj 待存储的对象，必须是可 JSON 序列化的
 */
export const setObject = (key, obj) => {
  setValue(key, JSON.stringify(obj));
};

/**
 * 获取存储的对象
 * @param key
 * @returns {any}
 */
export const getObject = (key) => {
  return JSON.parse(getValue(key, 'null'));
};
