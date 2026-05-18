import { Injectable } from '@angular/core';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  data?: unknown;
  error?: Error;
}

/**
 * Professional logging service for the application.
 * Provides structured logging with different severity levels.
 *
 * Usage:
 * ```typescript
 * constructor(private logger: LoggerService) {}
 *
 * ngOnInit() {
 *   this.logger.debug('Component initialized', { componentName: this.constructor.name });
 *   this.logger.info('User action', { action: 'opened-menu' });
 *   this.logger.warn('Missing data', { expected: 'userId' });
 *   this.logger.error('Failed to load data', error);
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private logLevel = LogLevel.DEBUG; // Change to INFO in production
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory

  debug(message: string, data?: unknown): void {
    this.log(LogLevel.DEBUG, message, data);
  }

  info(message: string, data?: unknown): void {
    this.log(LogLevel.INFO, message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log(LogLevel.WARN, message, data);
  }

  error(message: string, error?: Error | unknown, data?: unknown): void {
    let errorObj: Error | undefined;
    let additionalData = data;

    if (error instanceof Error) {
      errorObj = error;
    } else if (typeof error === 'string') {
      message = `${message}: ${error}`;
    } else if (error !== undefined) {
      additionalData = error;
    }

    this.log(LogLevel.ERROR, message, additionalData, errorObj);
  }

  /**
   * Get all logs in memory
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Set the minimum log level to display
   * @param level LogLevel to set as minimum
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Export logs as JSON for debugging
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  private log(level: LogLevel, message: string, data?: unknown, error?: Error): void {
    // Only log if level is >= configured logLevel
    if (level < this.logLevel) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      data,
      error,
    };

    this.logs.push(entry);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log to console in development
    const levelName = LogLevel[level];
    const formattedMessage = `[${levelName}] ${message}`;
    this.writeConsoleMessage(level, formattedMessage, data);

    if (error) {
      console.error('Error details:', error);
    }

    // Send to remote logging service in production
    // Example: this.sendToRemoteLogger(entry);
  }

  private writeConsoleMessage(level: LogLevel, message: string, data?: unknown): void {
    const hasData = data !== undefined;

    switch (level) {
      case LogLevel.DEBUG:
        if (hasData) {
          console.debug(message, data);
        } else {
          console.debug(message);
        }
        break;
      case LogLevel.INFO:
        if (hasData) {
          console.info(message, data);
        } else {
          console.info(message);
        }
        break;
      case LogLevel.WARN:
        if (hasData) {
          console.warn(message, data);
        } else {
          console.warn(message);
        }
        break;
      case LogLevel.ERROR:
        if (hasData) {
          console.error(message, data);
        } else {
          console.error(message);
        }
        break;
    }
  }

  // private sendToRemoteLogger(entry: LogEntry): void {
  //   // TODO: Implement remote logging (e.g., Sentry, LogRocket)
  //   // this.http.post('/api/logs', entry).subscribe();
  // }
}
