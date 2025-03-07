import { createClient } from 'redis';
import { REDIS_URL } from '@config';
import { NotificationService } from './notification.service';
import { logger } from '@/logger';

export class BackgroundNotificationsSenderService {
  private notificationService = new NotificationService();
  private client;
  private queueName: string;
  private pollingInterval: number;
  private pollingTask?: NodeJS.Timeout; // Stores the setInterval reference

  constructor(queueName: string, pollingInterval = 2000) {
    this.queueName = queueName;
    this.pollingInterval = pollingInterval;
    this.client = createClient({
      url: REDIS_URL, // Adjust if using a different Redis setup
    });

    this.client.on('error', err => console.error('Redis Error:', err));
  }

  async connect() {
    try {
      await this.client.connect();
      logger.debug(`Connected to Redis, listening to queue: "${this.queueName}"`);
      this.startPolling();
    } catch (error) {
      logger.error('Redis connection failed:', error);
    }
  }

  private startPolling() {
    this.pollingTask = setInterval(async () => {
      try {
        let payload = await this.client.rPop(this.queueName);
        if (payload == null || payload == undefined) {
          logger.debug('Queue is empty, waiting for new messages...');
          return;
        }
        payload = JSON.parse(payload);
        logger.debug(`Received user ${payload?.userId} notification: ${payload?.message}`);
        await this.notificationService.sendNotification(payload.userId, payload.message);
      } catch (error) {
        logger.error('Error fetching message:', error);
      }
    }, this.pollingInterval);
  }

  async stop() {
    if (this.pollingTask) {
      clearInterval(this.pollingTask);
      console.log('Stopped polling Redis queue');
    }
    await this.client.quit();
  }
}

// // Example Usage
// (async () => {
//   const consumer = new RedisConsumer('notifications', 2000); // Polls every 2 seconds
//   await consumer.connect();

//   // Stop after 30 seconds (for demo purposes)
//   setTimeout(async () => {
//     await consumer.stop();
//   }, 30000);
// })();
