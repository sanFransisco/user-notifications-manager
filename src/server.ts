import { App } from '@/app';
import { ValidateEnv } from '@utils/validateEnv';
import { NotificationRoute } from './routes/notifications.route';
import { BackgroundNotificationsSenderService } from './services/bg-notifications-sender.service';
import Container from 'typedi';

ValidateEnv();
const app = new App([new NotificationRoute()]);
const consumer = Container.get(BackgroundNotificationsSenderService);
consumer.connect();
app.listen();
