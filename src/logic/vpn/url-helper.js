import urlParse from "url-parse";

export const URL_NORMAL = 0;
export const URL_RELATIVE = 1;
export const URL_SAME_PROTOCOL = 2;
export const URL_FULL_SCHEME = 3;

/**
 * 获得 URL 格式类型
 * @param url
 * @returns {number|number}
 */
export const getUrlType = function (url) {
  if (url == null || "string" != typeof url)
    return URL_NORMAL;

  if ("h" === url.charAt(0) || "H" === url.charAt(0)) {
    if (/http(s)?:\/\//.test(url.slice(0, 8).toLowerCase()))
      return URL_FULL_SCHEME;
  } else if ("w" === url.charAt(0) || "W" === url.charAt(0)) {
    if (/ws(s)?:\/\//.test(url.slice(0, 6).toLowerCase()))
      return URL_FULL_SCHEME;
  } else if ("/" === url.charAt(0)) {
    return "/" === url.charAt(1) ? URL_SAME_PROTOCOL : URL_RELATIVE;
  } else if ("./" === url.slice(0, 2) || "../" === url.slice(0, 3)) {
    return URL_RELATIVE;
  } else if ("#" === url.charAt(0)) {
    return URL_NORMAL;
  }
  return URL_NORMAL;
};

/**
 * 通过 URL 类型获得跳转 URL
 * @param url
 * @param urlType
 * @returns {string|*}
 */
export const makeUrlFromType = function (url, urlType) {
  if (urlType === URL_RELATIVE)
    return url.pathname + url.query + url.hash;
  else if (urlType === URL_SAME_PROTOCOL)
    return "//" + url.host + url.pathname + url.query + url.hash;
  else if (urlType === URL_FULL_SCHEME)
    return url.href;
  else
    return urlParse(url);
};
