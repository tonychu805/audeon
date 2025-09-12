/**
 * Centralized logging utility
 * Replaces scattered console.log statements with structured logging
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  private formatMessage(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data
    };
  }

  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    const logEntry = this.formatMessage(level, message, args.length > 0 ? args : undefined);
    
    // Only log to console in development
    if (this.isDevelopment) {
      switch (level) {
        case 'error':
          console.error(`[${logEntry.timestamp}] ERROR:`, message, ...(args.length > 0 ? args : []));
          break;
        case 'warn':
          console.warn(`[${logEntry.timestamp}] WARN:`, message, ...(args.length > 0 ? args : []));
          break;
        case 'info':
          console.info(`[${logEntry.timestamp}] INFO:`, message, ...(args.length > 0 ? args : []));
          break;
        case 'debug':
          console.debug(`[${logEntry.timestamp}] DEBUG:`, message, ...(args.length > 0 ? args : []));
          break;
      }
    }
    
    // In production, we could send errors to a logging service
    if (!this.isDevelopment && level === 'error') {
      // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    }
  }

  info(message: string, ...args: unknown[]): void {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.log('error', message, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    this.log('debug', message, ...args);
  }
}

export const logger = new Logger();