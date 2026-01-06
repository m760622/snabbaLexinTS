/**
 * Centralized logging system with environment-aware levels
 */

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    NONE = 4
}

export interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: string;
    data?: any;
}

export class Logger {
    private static instance: Logger;
    private logs: LogEntry[] = [];
    private maxLogs = 1000;
    private currentLevel: LogLevel;

    private constructor() {
        // Set log level based on environment
        const isDev = (import.meta as any).env?.DEV || 
                     window.location.hostname === 'localhost' ||
                     window.location.hostname === '127.0.0.1';
        this.currentLevel = isDev ? LogLevel.DEBUG : LogLevel.ERROR;
    }

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private shouldLog(level: LogLevel): boolean {
        return level >= this.currentLevel;
    }

    private formatMessage(level: LogLevel, message: string, context?: string): string {
        const timestamp = new Date().toISOString();
        const levelStr = LogLevel[level];
        const contextStr = context ? `[${context}]` : '';
        return `${timestamp} ${levelStr} ${contextStr} ${message}`;
    }

    private addLog(level: LogLevel, message: string, context?: string, data?: any): void {
        if (!this.shouldLog(level)) return;

        const entry: LogEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            context,
            data
        };

        this.logs.push(entry);
        
        // Keep only recent logs
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(-this.maxLogs);
        }

        // Output to console in development
        if ((import.meta as any).env?.DEV) {
            const formattedMessage = this.formatMessage(level, message, context);
            
            switch (level) {
                case LogLevel.DEBUG:
                    console.debug(formattedMessage, data);
                    break;
                case LogLevel.INFO:
                    console.info(formattedMessage, data);
                    break;
                case LogLevel.WARN:
                    console.warn(formattedMessage, data);
                    break;
                case LogLevel.ERROR:
                    console.error(formattedMessage, data);
                    break;
            }
        }
    }

    debug(message: string, context?: string, data?: any): void {
        this.addLog(LogLevel.DEBUG, message, context, data);
    }

    info(message: string, context?: string, data?: any): void {
        this.addLog(LogLevel.INFO, message, context, data);
    }

    warn(message: string, context?: string, data?: any): void {
        this.addLog(LogLevel.WARN, message, context, data);
    }

    error(message: string, context?: string, data?: any): void {
        this.addLog(LogLevel.ERROR, message, context, data);
    }

    // Context-specific loggers
    app(message: string, data?: any): void {
        this.info(message, 'APP', data);
    }

    search(message: string, data?: any): void {
        this.info(message, 'SEARCH', data);
    }

    game(message: string, data?: any): void {
        this.info(message, 'GAME', data);
    }

    performance(message: string, data?: any): void {
        this.warn(message, 'PERF', data);
    }

    security(message: string, data?: any): void {
        this.error(message, 'SECURITY', data);
    }

    // Utility methods
    getLogs(): LogEntry[] {
        return [...this.logs];
    }

    clearLogs(): void {
        this.logs = [];
    }

    setLevel(level: LogLevel): void {
        this.currentLevel = level;
    }

    exportLogs(): string {
        return JSON.stringify(this.logs, null, 2);
    }

    // Performance monitoring
    time(label: string): void {
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.time(`[${label}]`);
        }
    }

    timeEnd(label: string): void {
        if (this.shouldLog(LogLevel.DEBUG)) {
            console.timeEnd(`[${label}]`);
        }
    }

    // Error boundary helper
    catchAndLog(error: Error, context?: string): void {
        this.error(error.message, context, {
            stack: error.stack,
            name: error.name
        });
    }
}

// Export singleton instance for easy usage
export const logger = Logger.getInstance();

// Export convenience functions for common usage
export const log = {
    debug: (message: string, context?: string, data?: any) => logger.debug(message, context, data),
    info: (message: string, context?: string, data?: any) => logger.info(message, context, data),
    warn: (message: string, context?: string, data?: any) => logger.warn(message, context, data),
    error: (message: string, context?: string, data?: any) => logger.error(message, context, data),
    app: (message: string, data?: any) => logger.app(message, data),
    search: (message: string, data?: any) => logger.search(message, data),
    game: (message: string, data?: any) => logger.game(message, data),
    performance: (message: string, data?: any) => logger.performance(message, data),
    security: (message: string, data?: any) => logger.security(message, data)
};