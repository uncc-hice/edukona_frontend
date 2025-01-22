import { useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { refreshAccessToken } from '../services/apiService';

interface WebSocketOptions {
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
  shouldReconnect?: (closeEvent: CloseEvent) => boolean;
  [key: string]: any;
}

const useWebSocketWithTokenRefresh = (
  url: string,
  options: WebSocketOptions = {},
) => {
  const { onOpen, onClose, onError, onMessage, shouldReconnect, ...restOptions } = options;
  const [shouldStop, setShouldStop] = useState(false);

  useEffect(() => {
    let refreshTimer: ReturnType<typeof setTimeout> | null = null;

    const scheduleRefresh = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      if (!accessToken || !refreshToken || shouldStop) return;

      try {
        const [, base64Url] = accessToken.split('.');
        const tokenPayload = JSON.parse(atob(base64Url));
        const expiresInMs = tokenPayload.exp * 1000 - Date.now();
        const buffer = 30 * 1000; // 30 seconds
        const refreshDelay = Math.max(expiresInMs - buffer, 0);

        refreshTimer = setTimeout(async () => {
          try {
            await refreshAccessToken(refreshToken);
            console.log('Token refreshed');
            scheduleRefresh();
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            // You may decide to stop further attempts
            setShouldStop(true);
          }
        }, refreshDelay);
      } catch (decodeError) {
        console.error('Token decode failed:', decodeError);
        try {
          await refreshAccessToken(refreshToken);
          scheduleRefresh();
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          setShouldStop(true);
        }
      }
    };

    scheduleRefresh();

    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      setShouldStop(true);
    };
  }, [shouldStop]);

  return useWebSocket(url, {
    onOpen: (event) => {
      console.log('WebSocket connected');
      if (onOpen) onOpen(event);
    },
    onClose: (event) => {
      console.log('WebSocket disconnected');
      if (onClose) onClose(event);
    },
    onError: (event) => {
      console.error('WebSocket error', event);
      if (onError) onError(event);
    },
    onMessage,
    shouldReconnect,
    // If you want a default reconnection logic
    // shouldReconnect: (closeEvent) => !shouldStop,
    ...restOptions,
  });
};

export default useWebSocketWithTokenRefresh;