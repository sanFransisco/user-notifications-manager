import { App } from '@/app';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { NotificationRoute } from './routes/notifications.route';
import { BackgroundNotificationsSenderService } from './services/bg-notifications-sender.service';
import { logger } from '@/logger';

ValidateEnv();
logger.info('🚀 The server is starting...');
const app = new App([new NotificationRoute(), new UserRoute()]);
const consumer = new BackgroundNotificationsSenderService('notifications', 500);
consumer.connect();
app.listen();
