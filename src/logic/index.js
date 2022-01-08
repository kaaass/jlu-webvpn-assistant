import {parse, unparse} from "@/logic/vpn/url-transformer";
import {vpnHost} from "@/logic/config";
import {getObject, setObject} from "@/logic/storage";

/**
 * 编码 URL 为 WebVPN 路径
 * @param url
 * @returns {*|string}
 */
export const encryptVpnUrl = (url) => {
  if (url.indexOf('://') === -1) {
    url = 'http://' + url;
  }
  return parse(vpnHost, '', url, '', true);
};

/**
 * 解码 WebVPN 路径为 URL
 * @param url
 * @returns {*|string}
 */
export const decryptVpnUrl = (url) => {
  return unparse(vpnHost, url, true);
};

const KEY_BOOKMARK = 'bookmark';
const DEFAULT_BOOKMARK = [
  {
    name: '中国知网',
    url: 'https://www.cnki.net',
  },
  {
    name: '百度文库',
    url: 'https://wenku.baidu.com',
  }
];

/**
 * 获得收藏
 * @returns {[{name: string, url: string}]}
 */
export const getBookmark = () => {
  const data = getObject(KEY_BOOKMARK);
  if (!data) {
    return DEFAULT_BOOKMARK;
  }
  return data;
};

/**
 * 是否已收藏
 * @param name
 * @returns {boolean}
 */
export const hasBookmark = (name) => {
  const data = getBookmark();
  return data.some(item => item.name === name);
};

/**
 * 添加收藏
 * @param name
 * @param url
 */
export const addBookmark = (name, url) => {
  const data = getBookmark();
  // 如果已存在，则不添加
  if (hasBookmark(name)) {
    return;
  }
  data.push({
    name,
    url,
  });
  setObject(KEY_BOOKMARK, data);
};

/**
 * 通过名称删除收藏
 * @param name
 */
export const removeBookmark = (name) => {
  let bookmark = getBookmark();
  bookmark = bookmark.filter(item => item.name !== name);
  setObject(KEY_BOOKMARK, bookmark);
};
