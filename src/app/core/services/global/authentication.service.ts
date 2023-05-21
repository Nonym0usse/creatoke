// Angular
import { Injectable } from '@angular/core';

// Constant classes
import { Constant } from './../../constants/constant';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() { }

  /**
   * Get user object
   */
  get user(): any {
    return JSON.parse(localStorage.getItem(Constant.USER_KEY) || '{}');
  }

  /**
   * Get user login status
   */
  get isUser(): boolean {
    return Object.keys(this.user).length >= 1;
  }
}
