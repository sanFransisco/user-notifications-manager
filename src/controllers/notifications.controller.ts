import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CreateUserContactDto, UpdateContactPreferenceDto } from '@/dtos/user-contact.dto';
import { NotificationService } from '@/services/notification.service';
import { logger } from '@/logger';

export class NotificationsController {
  public notificationService = Container.get(NotificationService);

  public createUserContact = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body: CreateUserContactDto = req.body;
      if (this.notificationService.getUserContactById(body.userId)) {
        res.status(400).send('User already exists');
        return;
      }
      logger.log(JSON.stringify(body));
      if (body.userId == null) {
        res.status(400).send('User ID is required');
        return;
      }
      const userContact = this.notificationService.createUserContact(body);
      res.status(200).send(userContact);
      next();
    } catch (ex) {
      res.status(500);
      logger.error(ex);
    }
  };

  public editPreference = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: Number = parseInt(req.params.userId as string, 10);
      const body: UpdateContactPreferenceDto = req.body;

      const edited = this.notificationService.editPreference(userId, body);
      if (edited) res.status(200).send('Preference updated');
      else res.status(404).json({ message: 'Preference didnt update' });
      next();
    } catch (ex) {
      res.status(500);
      logger.error(ex);
    }
  };

  public getUserContact = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId: Number = parseInt(req.params.userId as string, 10);
    const userContact = this.notificationService.getUserContactById(userId);
    if (userContact) res.status(200).send(userContact);
    else res.status(404).json({ message: `User ${userId} Contact doesn't exist` });
    next();
  };

  public sendNotification = async (req: Request, res: Response, next: NextFunction) => {
    if (this.notificationService.isNotificationServiceHealthy()) {
      this.notificationService.queueNotification(req);
    }
    res.status(200).send({ message: 'Notification sent' });
    next();
  };
}
