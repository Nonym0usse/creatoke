// Angular
import { Injectable } from '@angular/core';

// Constant classes
import { ApiConstant } from '../../constants/api-constant';
import { InterceptorService } from "../global/interceptor.service";

@Injectable({
    providedIn: 'root'
})
export class n8nService {

    firebaseToken = "";

    // NB : la protection d'accès est assurée par AuthGuard sur la route,
    // pas par une redirection dans le constructeur du service.
    constructor(private axiosInterceptorService: InterceptorService) {
        this.firebaseToken = localStorage.getItem('firebaseToken') ?? '';
    }
    /**
     * Get playlist data
     * @returns {object}
     */
    postVideoOnSocialNetwork(body: FormData): Promise<any> {
        return this.axiosInterceptorService.getAxiosInstance().post(ApiConstant.API + '/n8n/api/upload', body, {
            headers: {
                Authorization: `Bearer ${this.firebaseToken}`,
            },
        });
    }
}
