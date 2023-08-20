// Angular
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

// Services
import { AuthenticationService } from './authentication.service';
import { LoginService } from '../api/login.service';

// Constant classes
import { Constant } from '../../constants/constant';
import { HttpStatus } from './../../constants/http-status';
import axios, {AxiosError, AxiosInstance, AxiosResponse} from "axios";


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
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<any>) => {
        return response;
      },
      (error: AxiosError<any>) => {
        console.log(error.response)
        if (error.response && error.response.status === 401) {
          // Log user out or perform other actions
          this.authService.logOut(); // Call your logout method
        }
        return throwError(error);
      }
    );
  }

  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}
