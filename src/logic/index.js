import {parse} from "@/logic/vpn/url-transformer";
import {vpnHost} from "@/logic/config";

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
