/**
 * Logger utility for consistent logging across the application
 * Replaces console.log/error/warn with a centralized logging system
 * 
 * Features:
 * - Environment-aware logging (debug only in development)
 * - Contextual logging with component/service names
 * - Error tracking integration ready
 * - Structured log entries
 * 
 * @module logger
 */

/**
 * Log level type
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: unknown;
  error?: Error;
}

/**
 * Logger class for centralized logging
 * 
 * @example
 * ```ts
 * import { logger } from '@/lib/logger';
 * 
 * logger.debug('Debug message', { data: 'value' }, 'ComponentName');
 * logger.info('Info message');
 * logger.warn('Warning message');
 * logger.error('Error message', error, 'ComponentName');
 * ```
 */
class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  /**
   * Logs debug messages (only in development mode)
   * 
   * @param message - Log message
   * @param data - Optional data to log
   * @param context - Optional context (component/service name)
   */
  debug(message: string, data?: unknown, context?: string): void {
    if (this.isDevelopment) {
      this.log('debug', message, data, context);
    }
  }

  /**
   * Logs info messages (only in development mode)
   * 
   * @param message - Log message
   * @param data - Optional data to log
   * @param context - Optional context (component/service name)
   */
  info(message: string, data?: unknown, context?: string): void {
    if (this.isDevelopment) {
      this.log('info', message, data, context);
    }
  }

  /**
   * Logs warning messages (always logged)
   * 
   * @param message - Warning message
   * @param data - Optional data to log
   * @param context - Optional context (component/service name)
   */
  warn(message: string, data?: unknown, context?: string): void {
    this.log('warn', message, data, context);
  }

  /**
   * Logs error messages (always logged, sent to error tracking in production)
   * 
   * @param message - Error message
   * @param error - Error object or error data
   * @param context - Optional context (component/service name)
   */
  error(message: string, error?: Error | unknown, context?: string): void {
    const errorObj = error instanceof Error ? error : undefined;
    const errorData = error instanceof Error ? undefined : error;
    
    this.log('error', message, errorData, context, errorObj);
    
    // In production, send to error tracking service
    if (this.isProduction && errorObj) {
      this.sendToErrorTracking(errorObj, message, context);
    }
  }

  /**
   * Internal logging method
   */
  private log(
    level: LogLevel,
    message: string,
    data?: unknown,
    context?: string,
    error?: Error
  ): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      data,
      error,
    };

    const logMessage = this.formatMessage(entry);

    switch (level) {
      case 'debug':
        console.debug(logMessage, data || '');
        break;
      case 'info':
        console.info(logMessage, data || '');
        break;
      case 'warn':
        console.warn(logMessage, data || '');
        break;
      case 'error':
        console.error(logMessage, error || data || '');
        break;
    }
  }

  /**
   * Format log message with context
   */
  private formatMessage(entry: LogEntry): string {
    const context = entry.context ? `[${entry.context}]` : '';
    const timestamp = entry.timestamp;
    return `${timestamp} ${context} ${entry.message}`.trim();
  }

  /**
   * Send error to error tracking service (e.g., Sentry, LogRocket)
   * Override this method to integrate with your error tracking service
   */
  private sendToErrorTracking(error: Error, message: string, context?: string): void {
    // TODO: Integrate with error tracking service
    // Example: Sentry.captureException(error, { extra: { message, context } });
  }

  /**
   * Create a logger instance with a specific context
   */
  create(context: string): ContextualLogger {
    return new ContextualLogger(context);
  }
}

/**
 * Contextual logger with a fixed context
 * Created via logger.create(context) for convenience
 * 
 * @example
 * ```ts
 * const componentLogger = logger.create('MyComponent');
 * componentLogger.debug('Message'); // Automatically includes 'MyComponent' context
 * ```
 */
class ContextualLogger {
  constructor(private context: string) {}

  debug(message: string, data?: unknown): void {
    logger.debug(message, data, this.context);
  }

  info(message: string, data?: unknown): void {
    logger.info(message, data, this.context);
  }

  warn(message: string, data?: unknown): void {
    logger.warn(message, data, this.context);
  }

  error(message: string, error?: Error | unknown): void {
    logger.error(message, error, this.context);
  }
}

/**
 * Default logger instance
 * Use this for most logging needs
 * 
 * @example
 * ```ts
 * import { logger } from '@/lib/logger';
 * logger.info('Application started');
 * ```
 */
export const logger = new Logger();

/**
 * Logger class for creating custom instances
 */
export { Logger };

/**
 * Type exports
 */
export type { LogLevel, LogEntry };

