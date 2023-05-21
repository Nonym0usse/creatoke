// Angular
import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';

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

  canActivate(): boolean {
    return this.isRouteAccess();
  }

  canLoad(): boolean {
    return this.isRouteAccess();
  }

  /**
   * Check is user login.
   * @returns {boolean}
   */
  isRouteAccess(): boolean {
    if (this.authenticationService.isUser) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}
