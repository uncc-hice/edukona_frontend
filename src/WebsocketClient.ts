enum ConnectionState {
  CONNECTING = 'connecting',
  OPEN = 'open',
  CLOSING = 'closing',
  CLOSED = 'closed',
  RECONNECTING = 'reconnecting',
}

interface Message {
  type: string;
  data: any;
}

interface WebsocketClientOptions {
  errorHandler?: (error: Error) => void;
  reconnect?: boolean;
  debug?: boolean;
}

class WebSocketClient {
  private url: string;
  private ws: WebSocket | null = null;

  private errorHandler: (error: Error) => void;
  private messageHandler: (message: Message) => void;

  // Configuration
  private debug: boolean;
  private maxReconnectAttempts: number;
  private reconnect: boolean;
  private reconnectBackoffFactor: number;
  private reconnectDelay: number;

  // State
  private connectionState: ConnectionState = ConnectionState.CLOSED;
  private reconnectAttempts = 0;

  private onOpenCallbacks: (() => void)[] = [];
  private onCloseCallbacks: ((event: CloseEvent) => void)[] = [];

  constructor(url: string, messageHandler: (message: Message) => void, options: WebsocketClientOptions = {}) {
    this.url = url;
    this.messageHandler = messageHandler;

    this.errorHandler = options.errorHandler || ((err: Error) => console.error('WebSocket error:', err));
    this.reconnect = options.reconnect ?? false;
    this.debug = options.debug ?? false;

    this.maxReconnectAttempts = 5;
    this.reconnectBackoffFactor = 1.5;
    this.reconnectDelay = 100;
  }

  private attemptReconnect(): void {
    if (!this.reconnect || this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.log('Max reconnection attempts reached');
      return;
    }

    this.connectionState = ConnectionState.RECONNECTING;
    this.reconnectAttempts++;

    const delay = this.reconnectDelay * Math.pow(this.reconnectBackoffFactor, this.reconnectAttempts - 1);

    this.log(`Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);

    setTimeout(() => {
      this.connect();
    }, delay);
  }

  private connect(): void {
    try {
      this.log('Connecting to the WebSocket server...');
      this.connectionState = ConnectionState.CONNECTING;

      this.ws = new WebSocket(this.url);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
    } catch (error) {
      this.errorHandler(error instanceof Error ? error : new Error(String(error)));
      this.attemptReconnect();
    }
  }

  private handleClose(event: CloseEvent): void {
    this.log(`Connection closed: ${event.code} ${event.reason}`);
    this.connectionState = ConnectionState.CLOSED;

    this.onCloseCallbacks.forEach((callback) => callback(event));

    if (this.reconnect) {
      this.attemptReconnect();
    }
  }

  private handleError(event: Event): void {
    this.log('WebSocket error occurred', event);
    this.errorHandler(new Error('WebSocket error'));
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const message = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

      if (!message.type) throw new Error('Invalid message format: missing type');

      this.messageHandler(message);
    } catch (error) {
      this.errorHandler(error instanceof Error ? error : new Error(String(error)));
    }
  }

  private handleOpen(event: Event): void {
    this.log('Connection established');
    this.connectionState = ConnectionState.OPEN;
    this.reconnectAttempts = 0;

    this.onOpenCallbacks.forEach((callback) => callback());
  }

  private log(...args: any[]): void {
    if (this.debug) {
      console.log(`[WebSocketClient][${new Date().toISOString()}]`, ...args);
    }
  }
}
