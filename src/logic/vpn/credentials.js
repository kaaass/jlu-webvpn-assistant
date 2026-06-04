import axios from 'axios';
import {
  vpnCredentialMaxAge,
  vpnCredentialRequestTimeout,
  vpnCredentialStorageKey,
  vpnUserInfoUrl,
} from '@/logic/config';

let inFlightRequest = null;

const readStoredCredentials = () => {
  try {
    const rawValue = localStorage.getItem(vpnCredentialStorageKey);
    if (!rawValue) {
      return null;
    }
    const parsedValue = JSON.parse(rawValue);
    if (!parsedValue || typeof parsedValue !== 'object') {
      return null;
    }
    if (!parsedValue.iv || !parsedValue.key || !parsedValue.timestamp) {
      return null;
    }
    return parsedValue;
  } catch (error) {
    return null;
  }
};

const writeStoredCredentials = (credentials) => {
  const payload = {
    iv: credentials.iv,
    key: credentials.key,
    timestamp: Date.now(),
  };
  try {
    localStorage.setItem(vpnCredentialStorageKey, JSON.stringify(payload));
  } catch (error) {
    // localStorage may be unavailable or full; keep the in-memory value.
  }
};

const isFresh = (credentials) => {
  return Date.now() - credentials.timestamp <= vpnCredentialMaxAge;
};

const normalizeCredentials = (rawCredentials, status) => {
  return {
    iv: rawCredentials.iv,
    key: rawCredentials.key,
    timestamp: rawCredentials.timestamp || Date.now(),
    status,
  };
};

const requestCredentials = async () => {
  const response = await axios.get(vpnUserInfoUrl, {
    params: {
      t: Date.now(),
    },
    timeout: vpnCredentialRequestTimeout,
  });
  const {wrdvpnIV, wrdvpnKey} = response.data || {};
  if (!wrdvpnIV || !wrdvpnKey) {
    throw new Error('未获取到 VPN 凭据');
  }
  const credentials = normalizeCredentials({iv: wrdvpnIV, key: wrdvpnKey}, 'fresh');
  writeStoredCredentials(credentials);
  return credentials;
};

export const getVpnCredentials = async () => {
  const cachedCredentials = readStoredCredentials();
  if (cachedCredentials && isFresh(cachedCredentials)) {
    return normalizeCredentials(cachedCredentials, 'cached');
  }

  if (inFlightRequest) {
    return inFlightRequest;
  }

  inFlightRequest = requestCredentials()
    .catch((error) => {
      const fallbackCredentials = readStoredCredentials();
      if (fallbackCredentials) {
        return normalizeCredentials(fallbackCredentials, 'stale');
      }
      throw error;
    })
    .finally(() => {
      inFlightRequest = null;
    });

  return inFlightRequest;
};