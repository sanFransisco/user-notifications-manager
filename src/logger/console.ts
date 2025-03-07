// src/utils/logger.ts
export class Logger {
  private static instance: Logger;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {} // Private constructor to prevent direct instantiation

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public log = (message: string, ...optionalParams: any[]): void => {
    console.log(`[LOG] ${new Date().toISOString()} - ${message}`, ...optionalParams);
  };

  public warn = (message: string, ...optionalParams: any[]): void => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...optionalParams);
  };

  public error = (message: string, ...optionalParams: any[]): void => {
    const timestamp = new Date().toISOString();
    console.error(`[ERROR] ${timestamp} - ${message}`, ...optionalParams);
  };

  public info = (message: string, ...optionalParams: any[]): void => {
    const timestamp = new Date().toISOString();
    console.info(`[INFO] ${timestamp} - ${message}`, ...optionalParams);
  };

  public debug = (message: string, ...optionalParams: any[]): void => {
    if (process.env.NODE_ENV.toLowerCase() == 'development') {
      const timestamp = new Date().toISOString();
      console.debug(`[DEBUG] ${timestamp} - ${message}`, ...optionalParams);
    }
  };
}
