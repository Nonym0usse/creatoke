// Angular
import { Injectable } from '@angular/core';

// Constant classes
import { ApiConstant } from '../../constants/api-constant';
import { InterceptorService } from "../global/interceptor.service";

export type NetworkId = 'instagram' | 'facebook' | 'youtube' | 'bluesky' | 'linkedin' | 'twitter';

export interface PublishResult {
    network: NetworkId;
    status: 'ok' | 'error' | 'skipped';
    url?: string;
    message?: string;
}

@Injectable({
    providedIn: 'root'
})
export class VideoPublishService {

    // NB : la protection d'accès est assurée par AuthGuard sur la route
    constructor(private axiosInterceptorService: InterceptorService) { }

    private get headers() {
        return { Authorization: `Bearer ${localStorage.getItem('authToken') ?? ''}` };
    }

    /**
     * Réseaux configurés côté API
     */
    getNetworks(): Promise<{ data: { networks: { id: NetworkId; configured: boolean }[] } }> {
        return this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + '/video/networks', { headers: this.headers });
    }

    /**
     * Envoie la vidéo et la publie sur tous les réseaux configurés
     */
    publish(body: FormData): Promise<{ status: number; data: { results: PublishResult[] } }> {
        return this.axiosInterceptorService.getAxiosInstance().post(ApiConstant.API + '/video/publish', body, { headers: this.headers });
    }
}
