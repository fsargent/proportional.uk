// Logger configuration for Proportional.uk
// Provides structured logging with different log levels

// Define log levels
const LOG_LEVELS = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
    TRACE: 4
};

// Set default log level (can be overridden)
let currentLogLevel = LOG_LEVELS.INFO;

// Make log levels globally available
if (typeof window !== 'undefined') {
    window.LOG_LEVELS = LOG_LEVELS;
    window.LOG_LEVEL = currentLogLevel;
}

/**
 * Logger class with structured logging methods
 */
class Logger {
    constructor(component = 'App') {
        this.component = component;
    }
    
    /**
     * Set the global log level
     * @param {number} level - One of LOG_LEVELS values
     */
    static setLogLevel(level) {
        currentLogLevel = level;
        if (typeof window !== 'undefined') {
            window.LOG_LEVEL = level;
        }
    }
    
    /**
     * Get the current log level
     * @returns {number} Current log level
     */
    static getLogLevel() {
        return currentLogLevel;
    }
    
    /**
     * Format log message with timestamp and component
     * @param {string} level - Log level string
     * @param {string} message - Log message
     * @returns {string} Formatted message
     */
    formatMessage(level, message) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level}] [${this.component}] ${message}`;
    }
    
    /**
     * Log error message
     * @param {string} message - Error message
     * @param {*} data - Optional data to log
     */
    error(message, data = null) {
        if (currentLogLevel >= LOG_LEVELS.ERROR) {
            console.error(this.formatMessage('ERROR', message), data || '');
        }
    }
    
    /**
     * Log warning message
     * @param {string} message - Warning message
     * @param {*} data - Optional data to log
     */
    warn(message, data = null) {
        if (currentLogLevel >= LOG_LEVELS.WARN) {
            console.warn(this.formatMessage('WARN', message), data || '');
        }
    }
    
    /**
     * Log info message
     * @param {string} message - Info message
     * @param {*} data - Optional data to log
     */
    info(message, data = null) {
        if (currentLogLevel >= LOG_LEVELS.INFO) {
            console.info(this.formatMessage('INFO', message), data || '');
        }
    }
    
    /**
     * Log debug message
     * @param {string} message - Debug message
     * @param {*} data - Optional data to log
     */
    debug(message, data = null) {
        if (currentLogLevel >= LOG_LEVELS.DEBUG) {
            console.debug(this.formatMessage('DEBUG', message), data || '');
        }
    }
    
    /**
     * Log trace message
     * @param {string} message - Trace message
     * @param {*} data - Optional data to log
     */
    trace(message, data = null) {
        if (currentLogLevel >= LOG_LEVELS.TRACE) {
            console.log(this.formatMessage('TRACE', message), data || '');
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Logger,
        LOG_LEVELS
    };
}
