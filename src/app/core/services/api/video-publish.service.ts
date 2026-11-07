// Angular
import { Injectable } from '@angular/core';

// Constant classes
import { ApiConstant } from '../../constants/api-constant';
import { InterceptorService } from "../global/interceptor.service";

// Réseaux publiés via Upload-Post (« twitter » = X)
export type NetworkId = 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'linkedin' | 'twitter' | 'threads' | 'bluesky';

export interface PublishResult {
    network: NetworkId;
    status: 'ok' | 'error' | 'skipped';
    url?: string;
    message?: string;
}

export interface NetworkStatus {
    id: NetworkId;
    configured: boolean;
    account?: string;
    reauthRequired?: boolean;
}

export interface VideoPostStatus {
    id: number;
    status: 'running' | 'done' | 'failed';
    error: string | null;
    results: PublishResult[];
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
     * Réseaux connectés sur le compte Upload-Post
     */
    getNetworks(): Promise<{ data: { networks: NetworkStatus[]; error?: string } }> {
        return this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + '/video/networks', { headers: this.headers });
    }

    /**
     * Envoie la vidéo : l'API répond tout de suite avec l'id de la publication, qui continue en arrière-plan
     */
    publish(body: FormData): Promise<{ status: number; data: { status: 'running'; id: number } }> {
        return this.axiosInterceptorService.getAxiosInstance().post(ApiConstant.API + '/video/publish', body, { headers: this.headers });
    }

    /**
     * Avancement d'une publication et résultat de chaque réseau
     */
    getPost(id: number): Promise<{ data: VideoPostStatus }> {
        return this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + `/video/posts/${id}`, { headers: this.headers });
    }
}
