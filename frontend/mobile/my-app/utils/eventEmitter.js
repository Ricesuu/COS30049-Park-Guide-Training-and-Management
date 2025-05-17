// Custom event emitter for cross-platform use in React Native
// This allows us to communicate between different parts of the app
// Enhanced with debug logging for better token expiration tracking

class EventEmitter {
    constructor() {
        this.events = {};
        console.log("🔔 EventEmitter initialized");
    }

    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
        console.log(
            `📌 Listener registered for event: ${event}, total listeners: ${this.events[event].length}`
        );
        return () => this.off(event, listener);
    }

    off(event, listener) {
        if (!this.events[event]) return;
        const initialCount = this.events[event].length;
        this.events[event] = this.events[event].filter((l) => l !== listener);
        const removedCount = initialCount - this.events[event].length;
        console.log(
            `🧹 Removed ${removedCount} listener(s) from event: ${event}, remaining: ${this.events[event].length}`
        );
    }

    emit(event, ...args) {
        if (!this.events[event]) {
            console.log(`⚠️ No listeners registered for event: ${event}`);
            return;
        }
        console.log(
            `🔔 Emitting event: ${event} to ${this.events[event].length} listeners`
        );
        this.events[event].forEach((listener) => {
            try {
                listener(...args);
            } catch (error) {
                console.error(
                    `❌ Error in listener for event ${event}:`,
                    error
                );
            }
        });
    }

    once(event, listener) {
        const remove = this.on(event, (...args) => {
            remove();
            listener(...args);
        });
    }
}

// Create a singleton instance
const eventEmitter = new EventEmitter();
export default eventEmitter;

// Define event constants
export const AUTH_EVENTS = {
    TOKEN_EXPIRED: "AUTH_TOKEN_EXPIRED", // Simplified constant name to avoid issues with special characters
};
