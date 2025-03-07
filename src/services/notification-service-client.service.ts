import { Service } from 'typedi';
import { HttpService } from './http.service';
import { circuitBuilder } from './opossum-circuit-breaker';
import { NOTIFICATION_SERVICE_URL } from '@config';
import { logger } from '@/logger';

@Service()
export class NotificationServiceClient extends HttpService implements INotificationServiceClient {
  private breaker = circuitBuilder();

  constructor() {
    super(NOTIFICATION_SERVICE_URL);
  }

  isHealthy(): boolean {
    return !this.breaker.opened;
  }

  printBreakerStatus = () => console.log('Breaker status:', this.breaker.opened);

  public async sendEmail(email: String, message: String): Promise<any> {
    try {
      await this.breaker.fire(async () => await this.sendRequest('POST', '/send-email', { email, message }));
    } catch (ex) {
      logger.error('Error:', ex);
    }
  }

  public async sendSms(telephone: String, message: String): Promise<any> {
    try {
      await this.breaker.fire(async () => await this.sendRequest('POST', '/send-sms', { telephone, message }));
    } catch (ex) {
      logger.error('Error:', ex);
    }
  }
}

export interface INotificationServiceClient {
  isHealthy(): boolean;
  sendEmail(email: String, message: String): Promise<any>;
  sendSms(telephone: String, message: String): Promise<any>;
}

// I wanted to register the interface so i use later inversion of controll when injecting the service
// export const NOTIFICATION_CLIENT_TOKEN = 'NotificationServiceClient';
// Container.set<NotificationServiceClient>(NOTIFICATION_CLIENT_TOKEN, { value: new NotificationServiceClient() });
