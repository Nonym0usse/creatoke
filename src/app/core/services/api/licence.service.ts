// Angular
import { Injectable } from '@angular/core';

// Constant classes
import { ApiConstant } from '../../constants/api-constant';
import { AuthenticationService } from "../global/authentication.service";
import { InterceptorService } from "../global/interceptor.service";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LicenceService {

  firebaseToken = "";

  constructor(private authenticationService: AuthenticationService, private axiosInterceptorService: InterceptorService, private router: Router) {
    // @ts-ignore
    this.firebaseToken = localStorage.getItem('firebaseToken');
    this.authenticationService.isAuthenticated().subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/']);
      }
    });
  }
  /**
   * Get playlist data
   * @returns {object}
   */
  modifyLicence(body): Promise<any> {
    return this.axiosInterceptorService.getAxiosInstance().put(ApiConstant.API + '/licence/update', body, {
      headers: {
        Authorization: `Bearer ${this.firebaseToken}`
      }
    });
  }

  listLicence(): Promise<any> {
    return this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + '/licence/list-licence');
  }
}
