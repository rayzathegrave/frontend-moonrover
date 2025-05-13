class WebSocketClient {
    constructor(onMessage) {
        this.url = 'ws://145.49.127.248:1880/ws/groep9';
        this.socket = null;
        this.onMessage = onMessage;
    }

    connect() {
        this.socket = new WebSocket(this.url);

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.temperature_1 !== undefined) {
                    const reading = {
                        temperature: `${data.temperature_1}`,
                        timestamp: new Date().toISOString(),
                    };
                    this.onMessage(reading);
                }
            } catch (err) {
                console.error('[WebSocketClient] Failed to parse message:', err);
            }
        };

        this.socket.onopen = () => console.log('[WebSocket] Connected');
        this.socket.onerror = (err) => console.error('[WebSocket] Error:', err);
        this.socket.onclose = () => console.log('[WebSocket] Closed');
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}

export default WebSocketClient;
