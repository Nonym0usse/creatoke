// Angular
import { Injectable } from '@angular/core';
import { firstValueFrom, throwError } from 'rxjs';

// Services
import { AuthenticationService } from './authentication.service';

import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {
  private axiosInstance: AxiosInstance;

  constructor(private authService: AuthenticationService) {
    this.axiosInstance = axios.create();
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Interceptor for requests
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await this.getToken();
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor for responses
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<any>) => {
        return response;
      },
      (error: AxiosError<any>) => {
        console.error('HTTP response error:', error.response);
        if (error.response && error.response.status === 401) {
          // Log user out or perform other actions
          this.authService.logOut(); // Call your logout method
        }
        return throwError(error);
      }
    );
  }

  private async getToken(): Promise<string | null> {
    try {
      const token = await firstValueFrom(this.authService.getToken());
      return token ?? null;
    } catch (error) {
      console.error('Error fetching token:', error);
      return null;
    }
  }

  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}