import urlParse from 'url-parse';
import * as encrypt from './encrypt';
import _ from "lodash";
import {getUrlType, makeUrlFromType} from "./url-helper";

const REGEX_PROTOCOL = /^(http|ws)s?$/;
const REGEX_VPN_SCHEME = /^\/([^-\/]*)-?(\d+)?\/([^\/]*)(\/.*)?$/;

/**
 * 编码 URL
 * @param origin 当前 VPN 站点 host
 * @param baseURL 当前 URL
 * @param url 要编码的 URL
 * @param additionQuery 附加的查询参数
 * @param shouldEncrypt 是否加密
 * @returns {*|string|string}
 */
export const parse = (origin, baseURL, url, additionQuery = "", shouldEncrypt = false) => {
  // url 合并附加参数
  if (additionQuery) {
    const queryIndex = url.indexOf("?");
    const tagIndex = url.indexOf("#");
    if (queryIndex === -1 && tagIndex === -1) {
      // 没有查询参数和标签
      url += `?${additionQuery}`;
    } else if (queryIndex === -1) {
      // 没有查询参数
      url = url.substring(0, tagIndex) + `?${additionQuery}` + url.substring(tagIndex);
    } else {
      // 有查询参数
      url = url.slice(0, queryIndex + 1) + `${additionQuery}&` + url.slice(queryIndex + 1);
    }
  }
  // 处理 url
  let urlType = getUrlType(url);
  if (!urlType)
    return url;
  // 解析 url
  url = urlParse(url, baseURL)
  // 去除多余 “:”
  if (":" === url.hostname.charAt(url.hostname.length - 1))
    url.set("hostname", url.hostname.slice(0, -1));
  // 去除相对路径 ..
  url.set("pathname",
    _.reduce(url.pathname.split("/"),
      (acc, el) => {
        ".." === el ? acc.pop() : acc.push(el);
        return acc;
      }, []).join("/"));
  // 拼接最终url
  const protocol = url.protocol.slice(0, -1);
  const port = url.port && "-" + url.port;
  // 域名加密
  if (shouldEncrypt) {
    url.set("hostname", encrypt.parse(url["hostname"]));
  }
  // 拼接
  url = origin + "/"
    + protocol + port + "/" + url.hostname
    + url.pathname + url.query + url.hash;
  // 拼接结果
  return makeUrlFromType(urlParse(url), urlType);
};

/**
 * 解码 URL
 * @param origin 当前 VPN 站点 host
 * @param url 要解码的 URL
 * @param shouldEncrypt 是否加密
 * @returns {*|string}
 */
export const unparse = (origin, url, shouldEncrypt) => {
  // 去除 vpn 相关参数
  url = url.replace(/\?vpn-12-o[12]-[^&#]*&/, "?")
    .replace(/\?vpn-12-o[12]-[^&#]*/, "")
    .replace(/\?vpn-\d+&/, "?")
    .replace(/\?vpn-\d+/, "")
    .replace(/\?wrdrecordvisit=[^&#]*&/, "?")
    .replace(/\?wrdrecordvisit=[^&#]*/, "");
  // 解析 URL
  const urlType = getUrlType(url);
  if (!urlType)
    return url;
  url = urlParse(url, origin)
  // 不是 VPN Url
  if (url.host !== origin.replace(/^https?:\/\//, ""))
    return makeUrlFromType(url, urlType);
  // 按 VPN Url 格式解析
  const urlParts = url.pathname.match(REGEX_VPN_SCHEME);
  if (urlParts === null || !REGEX_PROTOCOL.test(urlParts[1]))
    return makeUrlFromType(url, urlType);
  // 拼接结果
  let [protocol, port, hostname, pathname] = urlParts.slice(1);
  if (shouldEncrypt) {
    hostname = encrypt.unparse(hostname);
  }
  url.set("hostname", hostname);
  url.set("protocol", protocol);
  url.set("port", port || "");
  url.set("pathname", pathname || "");
  return makeUrlFromType(url, urlType);
};
