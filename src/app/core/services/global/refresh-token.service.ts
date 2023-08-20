import { Injectable } from '@angular/core';
import {AuthenticationService} from "./authentication.service";
import {interval, take} from "rxjs";
import {ApiConstant} from "../../constants/api-constant";
import {InterceptorService} from "./interceptor.service";

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {
  private refreshInterval = 30 * 60 * 1000; // 30 minutes

  constructor(
    private authService: AuthenticationService, private axiosInterceptorService: InterceptorService
  ) {
    // Start the automatic refresh interval
    interval(this.refreshInterval)
      .pipe(take(1)) // Trigger immediately on service creation
      .subscribe(() => {
        this.refreshIdTokenIfNeeded().then(r => window.location.reload());
      });
  }

  async refreshIdTokenIfNeeded(): Promise<void> {
    try {
      const token = await this.authService.getFirebaseIdToken();
      // Send the token to your server to refresh it
      const refreshedToken = await this.refreshTokenOnServer(token);
      localStorage.setItem('firebaseToken', refreshedToken);
    } catch (error) {
      // Handle the error
    }
  }

  private async refreshTokenOnServer(token: string): Promise<string> {
    const response = await this.axiosInterceptorService.getAxiosInstance().post(ApiConstant.API + '/refresh-token', {token});
    return response.data.idToken;
  }
}
