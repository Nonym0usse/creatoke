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


@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(
    private authenticationService: AuthenticationService,
    private loginService: LoginService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.headers.has(Constant.INTERCEPTOR_SKIP_HEADER)) {
      const headers = request.headers.delete(Constant.INTERCEPTOR_SKIP_HEADER);
      return next.handle(request.clone({ headers }));
    }

    const headerJson: any = {};

    // add content-type only if not passed from service itself
    if (!request.headers.get('Content-type')) {
      headerJson['Content-type'] = 'application/json';
    }

    if (this.authenticationService.isUser) {
      headerJson.Authorization = 'Bearer ' + this.authenticationService.user;
    }

    const _request = request.clone({headers: new HttpHeaders(headerJson)});

    return next.handle(_request).pipe(
      retry(2),
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatus.UNAUTHORIZED) {
          this.loginService.userLogout();
          return next.handle(request);
        }
        return throwError(() => new Error(error.message));
      })
    );

  }
}
