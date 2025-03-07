import Container, { Inject, Service } from 'typedi';
import { UserContact } from '@models/user-contact.interface';
import { CreateUserContactDto, UpdateContactPreferenceDto } from '@/dtos/user-contact.dto';
import { usersContactsDb } from '../db/users-contacts';
import { NotificationServiceClient } from '@/services/notification-service-client.service';
import { createClient } from 'redis';
import { logger } from '@/logger';
import { REDIS_QUEUE_NAME, REDIS_URL } from '@/config';
import { Request } from 'express';

@Service()
export class NotificationService {
  private notificationServiceClient: NotificationServiceClient = Container.get(NotificationServiceClient);
  public isNotificationServiceHealthy(): Boolean {
    this.notificationServiceClient.printBreakerStatus();
    return this.notificationServiceClient.isHealthy();
  }

  public async queueNotification(req: Request): Promise<void> {
    const client = createClient({ url: REDIS_URL });
    const { userId, message } = req.body;
    logger.debug(req.body);
    await client.connect();
    await client.lPush(REDIS_QUEUE_NAME, JSON.stringify({ userId, message }));
    logger.debug('Queued notification');
  }

  public createUserContact(userContact: CreateUserContactDto): UserContact | null {
    usersContactsDb.addUserContact(userContact.userId, userContact.email, userContact.telephone, userContact.preferences);
    return userContact;
  }

  public editPreference(userId: Number, preference: UpdateContactPreferenceDto): Boolean {
    const userContact = usersContactsDb.getUserContactById(userId);
    if (!userContact) return false;
    logger.debug('Found user contact', userContact);
    userContact.email = preference.email;
    userContact.telephone = preference.telephone;
    userContact.preferences.email = preference.preferences?.email;
    userContact.preferences.sms = preference.preferences?.sms;
    logger.debug('Edited user contact', userContact);
    return true;
  }

  public getUserContactById(userId: Number): UserContact | null {
    return usersContactsDb.getUserContactById(userId);
  }

  public async sendNotification(userId: Number, message: String): Promise<void> {
    const userContact = this.getUserContactById(userId);
    if (userContact == null) {
      logger.debug('Didnt send notification, user not found');
      return;
    }
    if (userContact.preferences.email) {
      await this.notificationServiceClient.sendEmail(userContact.email, message);
    }
    if (userContact.preferences.sms) {
      await this.notificationServiceClient.sendSms(userContact.telephone, message);
    }
  }
}
