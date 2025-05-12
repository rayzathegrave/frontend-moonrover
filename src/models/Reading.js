// src/models/Reading.js

export default class Reading {
    constructor(temperature, timestamp = new Date()) {
        this.temperature = temperature;
        this.timestamp = timestamp;
    }

    static fromObject(obj) {
        return new Reading(obj.temperature, new Date(obj.timestamp));
    }

    toObject() {
        return {
            temperature: this.temperature,
            timestamp: this.timestamp.toISOString(),
        };
    }

    toString() {
        return `${this.temperature}°C @ ${this.timestamp.toLocaleString()}`;
    }
}
