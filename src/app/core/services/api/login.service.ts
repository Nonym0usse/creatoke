// Angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// Constant classes
import { Constant } from '../../constants/constant';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private router: Router
  ) { }

  /**
   * Set user data in local storage
   */
  userLogin(): void {
    localStorage.setItem(Constant.USER_KEY, JSON.stringify(Constant.DEFAULT_USER));
    this.router.navigate(['/app']);
  }

  /**
   * Remove user data from local storage
   */
  userLogout(): void {
    localStorage.removeItem(Constant.USER_KEY);
    this.router.navigate(['/']);
  }
}
