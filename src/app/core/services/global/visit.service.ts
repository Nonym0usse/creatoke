// Angular
import { Injectable } from '@angular/core';

// Constant classes
import { ApiConstant } from '../../constants/api-constant';
import { ADMIN_DEVICE_KEY, AUTH_TOKEN_KEY } from './authentication.service';
import { InterceptorService } from './interceptor.service';

/**
 * Compteur de visites, sans cookie : un signal au chargement du site.
 * L'API compte un visiteur par jour (empreinte anonyme, voir creatoke-api/services/siteVisits.ts)
 * et ignore les robots. Pas de signal :
 *  - sur un navigateur où un administrateur s'est déjà connecté (même déconnecté depuis),
 *  - sur la page de connexion (l'administrateur y arrive avant d'être reconnu),
 *  - en local, ni pour les navigateurs pilotés par un programme.
 */
@Injectable({
  providedIn: 'root'
})
export class VisitService {

  private sent = false;

  constructor(private axiosInterceptorService: InterceptorService) { }

  /** Visites par mois d'une année (12 nombres, janvier à décembre) — administrateurs */
  getVisits(year: number): Promise<{ data: { year: number; months: number[] } }> {
    return this.axiosInterceptorService.getAxiosInstance().get(ApiConstant.API + '/stats/visits', {
      params: { year },
      headers: { Authorization: `Bearer ${localStorage.getItem(AUTH_TOKEN_KEY) ?? ''}` },
    });
  }

  ping(): void {
    if (this.sent) return;
    this.sent = true;
    try {
      const host = window.location.hostname;
      if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.localhost')) return;
      if ((navigator as any).webdriver) return;
      if (window.location.pathname.startsWith('/login')) return;
      if (localStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(ADMIN_DEVICE_KEY)) return;
    } catch {
      // stockage indisponible : on compte quand même la visite
    }
    fetch(ApiConstant.API + '/stats/visit', { method: 'POST', keepalive: true, mode: 'cors' }).catch(() => undefined);
  }
}
