import {parse} from "@/logic/vpn/url-transformer";
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
 * 设置收藏
 * @param bookmark
 */
export const setBookmark = (bookmark) => {
  setObject(KEY_BOOKMARK, bookmark);
};
