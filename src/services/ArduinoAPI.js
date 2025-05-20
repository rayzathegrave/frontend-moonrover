// src/services/ArduinoAPI.js

const BASE_URL = 'http://145.49.111.54:1880/groep18';

class ArduinoAPI {
    static async startScript() {
        return fetch(`${BASE_URL}?digital_output_1=255`, { method: 'POST' });
    }

    static async stopScript() {
        return fetch(`${BASE_URL}?digital_output_1=127`, { method: 'POST' });
    }
}

export async function sendReadingToBackend(reading) {
    try {
        await fetch('http://localhost:8080/api/temperature', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reading),
        });
    } catch (err) {
        console.error('[API] Failed to save reading:', err);
    }
}


export default ArduinoAPI;

