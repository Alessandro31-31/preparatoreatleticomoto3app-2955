
/**
 * Error logging and reporting utility
 */

interface ErrorLog {
  id: string;
  timestamp: number;
  error: Error;
  context?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  handled: boolean;
}

class ErrorLogger {
  private logs: ErrorLog[];
  private maxLogs: number;

  constructor(maxLogs: number = 100) {
    this.logs = [];
    this.maxLogs = maxLogs;
  }

  /**
   * Log an error
   */
  log(
    error: Error,
    context?: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): void {
    const errorLog: ErrorLog = {
      id: `${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
      error,
      context,
      severity,
      handled: false,
    };

    this.logs.unshift(errorLog);

    // Enforce max logs limit
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Console log based on severity
    const prefix = `[${severity.toUpperCase()}]`;
    const message = context ? `${prefix} ${context}: ${error.message}` : `${prefix} ${error.message}`;

    switch (severity) {
      case 'critical':
      case 'high':
        console.error(message, error);
        break;
      case 'medium':
        console.warn(message, error);
        break;
      case 'low':
        console.log(message);
        break;
    }
  }

  /**
   * Get all error logs
   */
  getLogs(): ErrorLog[] {
    return [...this.logs];
  }

  /**
   * Get logs by severity
   */
  getLogsBySeverity(severity: 'low' | 'medium' | 'high' | 'critical'): ErrorLog[] {
    return this.logs.filter(log => log.severity === severity);
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Mark error as handled
   */
  markAsHandled(id: string): void {
    const log = this.logs.find(l => l.id === id);
    if (log) {
      log.handled = true;
    }
  }

  /**
   * Get unhandled errors
   */
  getUnhandledErrors(): ErrorLog[] {
    return this.logs.filter(log => !log.handled);
  }

  /**
   * Export logs as JSON
   */
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Export singleton instance
export const errorLogger = new ErrorLogger();

/**
 * Setup global error logging
 */
export function setupErrorLogging(): void {
  if (typeof global !== 'undefined') {
    const originalConsoleError = console.error;
    console.error = (...args: unknown[]) => {
      if (args[0] instanceof Error) {
        errorLogger.log(args[0], 'Global Error', 'high');
      }
      originalConsoleError.apply(console, args);
    };
  }
  
  console.log('[ErrorLogger] Error logging initialized');
}
