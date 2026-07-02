/**
 * Core Logging System with mandatory Trace ID traceability.
 * Designed to log asynchronously to avoid blocking the JS Thread with heavy serialization.
 */

export type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export interface LogContext {
  traceId: string;
  [key: string]: any;
}

export class Logger {
  /**
   * Helper to generate a unique Trace ID (UUIDv4 alternative) without external native dependencies.
   */
  public static generateTraceId(): string {
    const timestamp = Date.now().toString(36);
    const random = () => Math.random().toString(36).substring(2, 8);
    return `tr-${timestamp}-${random()}-${random()}`;
  }

  /**
   * Helper to safely format metadata asynchronously to prevent blocking the JS UI thread.
   */
  private static async formatMetadata(metadata: any): Promise<string> {
    if (!metadata) return '';
    try {
      // Lazy serialization to prevent locking main JS thread
      return JSON.stringify(metadata);
    } catch (e) {
      return `[Serialization Error: ${String(e)}]`;
    }
  }

  private static log(level: LogLevel, traceId: string, message: string, metadata?: any) {
    const timestamp = new Date().toISOString();
    
    // Non-blocking log processing
    setTimeout(() => {
      this.formatMetadata(metadata).then((metaStr) => {
        const metaOutput = metaStr ? ` | Meta: ${metaStr}` : '';
        const logLine = `[${timestamp}] [${traceId}] [${level}] ${message}${metaOutput}`;
        
        switch (level) {
          case 'DEBUG':
            console.log(logLine);
            break;
          case 'INFO':
            console.info(logLine);
            break;
          case 'WARN':
            console.warn(logLine);
            break;
          case 'ERROR':
            console.error(logLine);
            break;
        }
      });
    }, 0);
  }

  public static debug(traceId: string, message: string, metadata?: any) {
    this.log('DEBUG', traceId, message, metadata);
  }

  public static info(traceId: string, message: string, metadata?: any) {
    this.log('INFO', traceId, message, metadata);
  }

  public static warn(traceId: string, message: string, metadata?: any) {
    this.log('WARN', traceId, message, metadata);
  }

  public static error(traceId: string, message: string, metadata?: any) {
    this.log('ERROR', traceId, message, metadata);
  }
}
