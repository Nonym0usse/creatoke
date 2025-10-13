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
export class n8nService {

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
    postVideoOnSocialNetwork(body): Promise<any> {
        return this.axiosInterceptorService.getAxiosInstance().post(ApiConstant.API + '/n8n/api/upload', body, {
            headers: {
                Authorization: `Bearer ${this.firebaseToken}`,
            },
        });
    }
}
