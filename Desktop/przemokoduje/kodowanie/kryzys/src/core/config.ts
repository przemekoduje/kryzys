/**
 * App Configuration Manager
 * Safely reads and validates environment variables (prefixed with EXPO_PUBLIC_)
 */

export interface AppConfig {
  apiUrl: string;
  logLevel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  offlineDbName: string;
}

const getEnv = (key: string, fallback: string): string => {
  return process.env[key] || fallback;
};

export const Config: AppConfig = {
  apiUrl: getEnv('EXPO_PUBLIC_API_URL', 'http://localhost:5001'),
  logLevel: (getEnv('EXPO_PUBLIC_LOG_LEVEL', 'INFO') as any) || 'INFO',
  offlineDbName: getEnv('EXPO_PUBLIC_OFFLINE_DB_NAME', 'kryzys_offline_db'),
};
