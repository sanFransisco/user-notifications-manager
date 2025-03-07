import { Service } from 'typedi';
import { HttpService } from './http.service';
import { circuitBuilder } from './opossum-circuit-breaker';
import { NOTIFICATION_SERVICE_URL } from '@config';
import { Container } from 'typedi';

// // Define the types of parameters for the async function
// function asyncFunctionThatCouldFail(x: number, y: number): Promise<number> {
//   return new Promise((resolve, reject) => {
//     // Simulate some asynchronous operation
//     // For example, calling an API or reading from a disk
//     if (Math.random() > 0.5) {
//       resolve(x + y); // Success
//     } else {
//       reject(new Error('Something went wrong!')); // Failure
//     }
//   });
// }

@Service()
export class NotificationClientService extends HttpService {
  private breaker = circuitBuilder();

  constructor(baseURL: string) {
    console.log(baseURL);
    super(baseURL);
  }
  printBreakerStatus = () => console.log('Breaker status:', this.breaker.status);
  isBreakerClosed = () => this.breaker.status == 'closed';

  public async sendEmail(email: String, message: String): Promise<any> {
    try {
      await this.breaker.fire(async () => await this.sendRequest('POST', '/send-email', { email, message }));
    } catch (ex) {
      console.log('Error:', ex);
    }
  }

  public async sendSms(telephone: String, message: String): Promise<any> {
    try {
      await this.breaker.fire(async () => await this.sendRequest('POST', '/send-sms', { telephone, message }));
    } catch (ex) {
      console.log('Error:', ex);
    }
  }
}

Container.set(NotificationClientService, new NotificationClientService(NOTIFICATION_SERVICE_URL));
