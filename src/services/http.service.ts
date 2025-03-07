import { AxiosClient } from './axios-instance';
import { AxiosInstance, AxiosResponse } from 'axios';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

abstract class HttpService {
  protected axiosClient: AxiosInstance;

  constructor(baseURL: string) {
    const client = new AxiosClient(baseURL);
    this.axiosClient = client.getClient();
  }

  public async sendRequest(method: HttpMethod, url: string, body: any = null): Promise<AxiosResponse> {
    try {
      const options: any = {
        method,
        url,
      };

      if (body && (method === 'POST' || method === 'PUT')) {
        options.data = body;
      }

      const res = await this.axiosClient(options);
      if (res.status == 429 || res.status > 500) throw new Error('Service cant answer the request');
      return res;
    } catch (error: any) {
      console.error(`Error with ${method} request to ${url}:`, error);
      throw new Error(error.message);
    }
  }

  public async get(url: string, params?: any): Promise<any> {
    const response = await this.sendRequest('GET', url, params);
    return response.data;
  }

  public async post(url: string, body?: any): Promise<any> {
    const response = await this.sendRequest('POST', url, body);
    return response.data;
  }

  public async put(url: string, body?: any): Promise<any> {
    const response = await this.sendRequest('PUT', url, body);
    return response.data;
  }

  public async delete(url: string, params?: any): Promise<any> {
    const response = await this.sendRequest('DELETE', url, params);
    return response.data;
  }
}

export { HttpService };
