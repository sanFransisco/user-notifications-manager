import { AxiosClient } from './axios-instance';
import { AxiosInstance, AxiosResponse } from 'axios';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

abstract class HttpService {
  protected axiosClient: AxiosInstance;

  constructor(baseURL: string) {
    const client = new AxiosClient(baseURL);
    this.axiosClient = client.getClient();
  }

  // Generic function to send HTTP requests
  public async sendRequest(method: HttpMethod, url: string, body: any = null): Promise<AxiosResponse> {
    try {
      const options: any = {
        method,
        url,
      };

      // If method is POST or PUT and body is provided, attach it
      if (body && (method === 'POST' || method === 'PUT')) {
        options.data = body;
      }

      const res = await this.axiosClient(options); // Send the request
      if (res.status == 429 || res.status > 500) throw new Error('Service cant answer the request');
      return res;
    } catch (error: any) {
      console.error(`Error with ${method} request to ${url}:`, error);
      throw new Error(error.message);
    }
  }

  // Method to send a GET request
  public async get(url: string, params?: any): Promise<any> {
    const response = await this.sendRequest('GET', url, params);
    return response.data;
  }

  // Method to send a POST request
  public async post(url: string, body?: any): Promise<any> {
    const response = await this.sendRequest('POST', url, body);
    return response.data;
  }

  // Method to send a PUT request
  public async put(url: string, body?: any): Promise<any> {
    const response = await this.sendRequest('PUT', url, body);
    return response.data;
  }

  // Method to send a DELETE request
  public async delete(url: string, params?: any): Promise<any> {
    const response = await this.sendRequest('DELETE', url, params);
    return response.data;
  }
}

export { HttpService };
