// src/services/IndexedDBService.js
import Reading from '../models/Reading';

const DB_NAME = 'ArduinoControlDB';
const STORE_NAME = 'readings';

class IndexedDBService {
    static db = null;

    static async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 1);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                db.createObjectStore(STORE_NAME, { keyPath: 'timestamp' });
            };

            request.onsuccess = (event) => {
                IndexedDBService.db = event.target.result;
                resolve();
            };

            request.onerror = () => reject(request.error);
        });
    }

    static async addReading(reading) {
        const tx = IndexedDBService.db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put(reading.toObject());
        return tx.complete;
    }

    static async getAllReadings() {
        return new Promise((resolve, reject) => {
            const tx = IndexedDBService.db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => {
                const raw = request.result;
                resolve(raw.map(Reading.fromObject));
            };

            request.onerror = () => reject(request.error);
        });
    }

    static async clearReadings() {
        const tx = IndexedDBService.db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).clear();
        return tx.complete;
    }
}

export default IndexedDBService;
