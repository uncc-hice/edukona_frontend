import { useCallback, useEffect, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { useContext } from 'react';
import { UserContext } from '../UserContext';

interface WebSocketOptions {
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  onMessage?: (event: MessageEvent) => void;
  shouldReconnect?: (closeEvent: CloseEvent) => boolean;
  [key: string]: any;
}

const useWebSocketWithTokenRefresh = (url: string, options: WebSocketOptions = {}) => {
  const { onOpen, onClose, onError, onMessage, shouldReconnect, ...restOptions } = options;
  const [tokenVerified, setTokenVerified] = useState<boolean>(false);
  const { refreshTokens, timeUntilRefresh, validateToken } = useContext(UserContext);

  const conditionalRefresh = useCallback(() => {
    try {
      // Verify the token is not malformed and is still valid
      const is_valid = validateToken();
      if (!is_valid) {
        refreshTokens();
        return;
      }

      // Refresh the token if it is about to expire
      const refreshThreshold = 60; // seconds
      if (timeUntilRefresh() < refreshThreshold) {
        refreshTokens();
      }
      setTokenVerified(true);
    } catch (error) {
      console.error('Error during token refresh:', error);
      setTokenVerified(false);
    }
  }, [refreshTokens, timeUntilRefresh, validateToken]);

  useEffect(() => {
    conditionalRefresh();
  }, [conditionalRefresh]);

  const getWebSocketAuth = () => {
    if (!localStorage.getItem('accessToken')) {
      return '';
    }
    return `?jwt=${localStorage.getItem('accessToken')}`;
  };

  const composeURL = () => {
    return url + getWebSocketAuth();
  };

  return useWebSocket(tokenVerified ? composeURL() : null, {
    onOpen: (event) => {
      console.log('WebSocket connected');
      if (onOpen) onOpen(event);
    },
    onClose: (event) => {
      console.log('WebSocket disconnected');
      conditionalRefresh();
      if (onClose) onClose(event);
    },
    onError: (event) => {
      console.error('WebSocket error', event);
      conditionalRefresh();
      if (onError) onError(event);
    },
    onMessage,
    shouldReconnect,
    ...restOptions,
  });
};

export default useWebSocketWithTokenRefresh;
