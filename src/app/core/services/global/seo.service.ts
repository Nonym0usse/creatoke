// Angular
import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * Référencement d'une route, déclaré dans `data.seo` :
 * - title / description : titre de l'onglet et description lue par les moteurs de recherche ;
 * - noindex : page à ne pas indexer (administration, erreur, confirmation d'achat) ;
 * - dynamic : la page fixe elle-même sa description une fois ses données chargées
 *   (rubriques, fiches chanson).
 * Sans description, c'est celle de index.html qui s'applique (page d'accueil).
 */
export interface RouteSeo {
    title?: string;
    description?: string;
    noindex?: boolean;
    dynamic?: boolean;
}

// Au-delà, Google coupe la description dans ses résultats
const MAX_DESCRIPTION = 160;

@Injectable({
    providedIn: 'root'
})
export class SeoService {

    private readonly defaultDescription: string;

    constructor(private meta: Meta, private title: Title, private router: Router) {
        this.defaultDescription = this.meta.getTag('name="description"')?.content ?? '';
    }

    /** À appeler une fois, au démarrage de l'application. */
    init(): void {
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => this.applyRoute());
    }

    /** Description de la page ; vide = description par défaut (index.html). */
    setDescription(text?: string | null): void {
        const clean = (text ?? '').replace(/\s+/g, ' ').trim();
        this.meta.updateTag({ name: 'description', content: clean ? this.truncate(clean) : this.defaultDescription });
    }

    /** Demande aux moteurs de recherche de ne pas indexer la page affichée. */
    noindex(): void {
        this.meta.updateTag({ name: 'robots', content: 'noindex' });
    }

    private applyRoute(): void {
        let route: ActivatedRouteSnapshot = this.router.routerState.snapshot.root;
        while (route.firstChild) route = route.firstChild;
        const seo: RouteSeo = route.data?.['seo'] ?? {};

        if (seo.noindex) this.noindex();
        else this.meta.removeTag('name="robots"');
        if (seo.title) this.title.setTitle(seo.title);
        if (!seo.dynamic) this.setDescription(seo.description);
    }

    private truncate(text: string): string {
        const chars = Array.from(text);
        if (chars.length <= MAX_DESCRIPTION) return text;
        const cut = chars.slice(0, MAX_DESCRIPTION - 1).join('');
        return cut.slice(0, cut.lastIndexOf(' ') > 100 ? cut.lastIndexOf(' ') : cut.length).trimEnd() + '…';
    }
}
