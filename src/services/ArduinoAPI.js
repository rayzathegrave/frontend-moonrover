// src/services/ArduinoAPI.js

const BASE_URL = 'http://145.49.127.248:1880/groep9';

class ArduinoAPI {
    static async startScript() {
        return fetch(`${BASE_URL}?digital_output_1=255`, { method: 'POST' });
    }

    static async stopScript() {
        return fetch(`${BASE_URL}?digital_output_1=127`, { method: 'POST' });
    }
}

export default ArduinoAPI;