/**
 * Simple logger utility for consistent logging across the application
 * In a production environment, this could be replaced with a more robust solution
 * like Winston or Pino
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private context: string;

  constructor(context: string = 'App') {
    this.context = context;
  }

  private log(level: LogLevel, message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${this.context}]`;
    
    switch (level) {
      case 'info':
        console.info(`${prefix} ${message}`, ...args);
        break;
      case 'warn':
        console.warn(`${prefix} ${message}`, ...args);
        break;
      case 'error':
        console.error(`${prefix} ${message}`, ...args);
        break;
      case 'debug':
        console.debug(`${prefix} ${message}`, ...args);
        break;
    }
  }

  info(message: string, ...args: any[]): void {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: any[]): void {
    this.log('error', message, ...args);
  }

  debug(message: string, ...args: any[]): void {
    this.log('debug', message, ...args);
  }

  // Create a new logger with a different context
  withContext(context: string): Logger {
    return new Logger(context);
  }
}

// Export a default logger instance
const logger = new Logger('PropertyApp');
export default logger;