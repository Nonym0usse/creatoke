import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, from } from 'rxjs';
import { catchError, retry, switchMap } from 'rxjs/operators';
import { AuthenticationService } from './authentication.service';
import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  private axiosInstance: AxiosInstance;

  constructor(private authService: AuthenticationService) {
    this.axiosInstance = axios.create();
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<any>) => response,
      async (error: AxiosError<any>) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (!originalRequest) {
          return Promise.reject(error);
        }

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const newToken = await this.authService.refreshToken();
            if (newToken) {
              sessionStorage.setItem('firebaseToken', newToken);
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
              return this.axiosInstance(originalRequest);
            }
          } catch (refreshError) {
            console.error('Erreur lors du rafraîchissement du token:', refreshError);
            this.authService.logOut();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem('firebaseToken');
    let headers = req.headers;

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const clonedRequest = req.clone({ headers });

    return next.handle(clonedRequest).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return from(this.authService.refreshToken()).pipe(
            switchMap(() => {
              const newToken = sessionStorage.getItem('firebaseToken');
              if (newToken) {
                const newHeaders = req.headers.set('Authorization', `Bearer ${newToken}`);
                const newRequest = req.clone({ headers: newHeaders });
                return next.handle(newRequest);
              }
              return throwError(() => error);
            }),
            catchError(refreshError => {
              this.authService.logOut();
              return throwError(() => refreshError);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
}