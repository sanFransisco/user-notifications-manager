import { createClient } from 'redis';
import { REDIS_URL } from '@config';
import { NotificationService } from './notification.service';
import { logger } from '@/logger';
import { Inject, Service } from 'typedi';
import { BG_NOTIFICATIONS_SENDER_INTERVAL, REDIS_QUEUE_NAME } from '@/config';

@Service()
export class BackgroundNotificationsSenderService {
  private client;
  private queueName: string;
  private pollingInterval: number;
  private pollingTask?: NodeJS.Timeout;

  constructor(@Inject(() => NotificationService) private notificationService: NotificationService) {
    this.queueName = REDIS_QUEUE_NAME;
    this.pollingInterval = parseInt(BG_NOTIFICATIONS_SENDER_INTERVAL, 10) || 1000;
    this.client = createClient({
      url: REDIS_URL,
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
