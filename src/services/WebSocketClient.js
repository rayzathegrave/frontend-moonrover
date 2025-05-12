// src/services/WebSocketClient.js
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
                if (this.onMessage) this.onMessage(event.data); // Pass raw data to the callback
            } catch (err) {
                console.error('Failed to process message:', err);
            }
        };

        this.socket.onopen = () => console.log('WebSocket connected');
        this.socket.onerror = (err) => console.error('WebSocket error:', err);
        this.socket.onclose = () => console.log('WebSocket closed');
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}

export default WebSocketClient;