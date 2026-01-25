// Angular
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../../core/services/global/authentication.service';

// Constant classes
import { Constant } from '../../constants/constant';

@Injectable({
    providedIn: 'root'
})
export class LoginService {
    message: string = "";
    constructor(
        private router: Router,
        private authService: AuthenticationService,
    ) {
      this.authService.isAuthenticated().subscribe((isAuthenticated) => {
        if(isAuthenticated){
          this.router.navigate(['/']);
        }
      });
    }

    /**
     * Set user data in local storage
     */


    /**
     * Remove user data from local storage
     */
    userLogout(): void {
        localStorage.removeItem(Constant.USER_KEY);
        this.router.navigate(['/']);
    }
}
