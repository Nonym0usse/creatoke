// Angular
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CanActivate, CanLoad, Router, Route, UrlSegment } from '@angular/router';

// Services
import { AuthenticationService } from './authentication.service';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

  canActivate(): Observable<boolean> {
    return this.checkAuthStatus();
  }

  canLoad(router: Route, segments: UrlSegment[]): Observable<boolean> {
    return this.checkAuthStatus();
  }

  private checkAuthStatus(): Observable<boolean> {

    return this.authenticationService.isAuthenticated().pipe(
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigate(['/login']);
        }
      })
    );
  }
}
