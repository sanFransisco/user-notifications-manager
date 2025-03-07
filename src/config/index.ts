import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  WINDOW_TIMEOUT,
  WINDOW_COUNT,
  BG_NOTIFICATIONS_SENDER_INTERVAL,
  REDIS_QUEUE_NAME,
  NODE_ENV,
  NOTIFICATION_SERVICE_URL,
  NOTIFICATION_SERVICE_PORT,
  PORT,
  REDIS_URL,
} = process.env;
