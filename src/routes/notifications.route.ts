import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { NotificationsController } from '@/controllers/notifications.controller';

export class NotificationRoute implements Routes {
  public router = Router();
  public notifications = new NotificationsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/notifications', this.notifications.createUserContact);
    this.router.put('/notifications', this.notifications.editPreference);
    this.router.get('/notifications/:userId', this.notifications.getUserContact);
    this.router.post('/notifications/send', this.notifications.sendNotification);
  }
}
