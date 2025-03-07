import { Service } from 'typedi';
import { UserContact } from '@models/user-contact.interface';
import { Container } from 'typedi';
import { CreateUserContactDto, UpdateContactPreferenceDto } from '@/dtos/user-contact.dto';
import { usersContactsDb } from '../db/users-contacts';
import { NotificationClientService } from '@/services/notification-service-client.service';
import { logger } from '@/logger';

@Service()
export class NotificationService {
  private notificationServiceClient = Container.get(NotificationClientService);

  public isNotificationServiceHealthy(): Boolean {
    //this.notificationServiceClient.printBreakerStatus();
    return this.notificationServiceClient.isBreakerClosed();
  }

  public createUserContact(userContact: CreateUserContactDto): UserContact | null {
    usersContactsDb.addUserContact(userContact.userId, userContact.email, userContact.telephone, userContact.preferences);
    return userContact;
  }

  public editPreference(userId: Number, preference: UpdateContactPreferenceDto): Boolean {
    const userContact = usersContactsDb.getUserContactById(userId);
    if (!userContact) return false;
    logger.debug('found user contact', userContact);
    userContact.email = preference.email;
    userContact.telephone = preference.telephone;
    userContact.preferences.email = preference.preferences?.email;
    userContact.preferences.sms = preference.preferences?.sms;
    logger.debug('edited user contact', userContact);
    return true;
  }

  public getUserContactById(userId: Number): UserContact | null {
    return usersContactsDb.getUserContactById(userId);
  }

  public async sendNotification(userId: Number, message: String): Promise<void> {
    const userContact = this.getUserContactById(userId);
    if (userContact == null) {
      logger.debug('User not found');
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
