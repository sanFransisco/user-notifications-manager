import axios, { AxiosInstance } from 'axios';

// Axios client class
class AxiosClient {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL, // base URL for the service
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Method to get the client instance
  public getClient(): AxiosInstance {
    return this.client;
  }
}

export { AxiosClient };
