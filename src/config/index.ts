import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, NOTIFICATION_SERVICE_URL, NOTIFICATION_SERVICE_PORT, PORT, REDIS_URL } = process.env;
