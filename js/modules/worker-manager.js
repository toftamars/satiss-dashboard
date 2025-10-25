/* global Worker, navigator */
/**
 * Worker Manager
 * Web Workers yönetimi
 */

class WorkerManager {
    constructor() {
        this.workers = new Map();
        this.maxWorkers = navigator.hardwareConcurrency || 4;
        this.activeWorkers = 0;
    }

    /**
     * Create worker
     */
    createWorker(name, scriptPath) {
        if (this.workers.has(name)) {
            return this.workers.get(name);
        }

        try {
            const worker = new Worker(scriptPath, { type: 'module' });
            this.workers.set(name, worker);
            this.activeWorkers++;

            console.log(`[WorkerManager] Worker created: ${name}`);
            return worker;
        } catch (error) {
            console.error(`[WorkerManager] Failed to create worker: ${name}`, error);
            return null;
        }
    }

    /**
     * Execute task in worker
     */
    async executeTask(workerName, taskType, data) {
        return new Promise((resolve, reject) => {
            const worker = this.workers.get(workerName);

            if (!worker) {
                reject(new Error(`Worker not found: ${workerName}`));
                return;
            }

            const timeout = setTimeout(() => {
                reject(new Error('Worker timeout'));
            }, 30000); // 30 second timeout

            const messageHandler = event => {
                clearTimeout(timeout);
                worker.removeEventListener('message', messageHandler);

                if (event.data.type === 'ERROR') {
                    reject(new Error(event.data.error));
                } else {
                    resolve(event.data);
                }
            };

            worker.addEventListener('message', messageHandler);
            worker.postMessage({ type: taskType, data });
        });
    }

    /**
     * Terminate worker
     */
    terminateWorker(name) {
        const worker = this.workers.get(name);
        if (worker) {
            worker.terminate();
            this.workers.delete(name);
            this.activeWorkers--;
            console.log(`[WorkerManager] Worker terminated: ${name}`);
        }
    }

    /**
     * Terminate all workers
     */
    terminateAll() {
        this.workers.forEach((worker, name) => {
            this.terminateWorker(name);
        });
    }

    /**
     * Get worker status
     */
    getStatus() {
        return {
            maxWorkers: this.maxWorkers,
            activeWorkers: this.activeWorkers,
            workers: Array.from(this.workers.keys())
        };
    }
}

// Singleton instance
const workerManager = new WorkerManager();

export { workerManager };
