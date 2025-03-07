import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { NotificationsController } from '@/controllers/notifications.controller';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { CreateUserContactDto, SendNotificationDto, UpdateContactPreferenceDto } from '@/dtos/user-contact.dto';

export class NotificationRoute implements Routes {
  public router = Router();
  public notifications = new NotificationsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/notifications', ValidationMiddleware(CreateUserContactDto), this.notifications.createUserContact);
    this.router.put('/notifications/:userId', ValidationMiddleware(UpdateContactPreferenceDto), this.notifications.editPreference);
    this.router.get('/notifications/:userId', this.notifications.getUserContact);
    this.router.post('/notifications/send', ValidationMiddleware(SendNotificationDto), this.notifications.sendNotification);
  }
}
