import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CategoryService } from 'src/app/core/services/api/category.service';

interface TocEntry {
    id: string;
    label: string;
    icon: string;
}

@Component({
    selector: 'app-rgpd',
    templateUrl: './rgpd.component.html'
})
export class RgpdComponent implements OnInit {
    picturebackground: any;

    readonly lastUpdate = '22/06/2025';
    readonly contactEmail = 'contact@creatoke.fr';

    readonly toc: TocEntry[] = [
        { id: 'donnees', label: 'Données collectées', icon: 'ri-database-2-line' },
        { id: 'finalite', label: 'Finalité', icon: 'ri-focus-3-line' },
        { id: 'base-legale', label: 'Base légale', icon: 'ri-scales-3-line' },
        { id: 'conservation', label: 'Conservation', icon: 'ri-archive-line' },
        { id: 'droits', label: 'Vos droits', icon: 'ri-user-settings-line' },
        { id: 'securite', label: 'Sécurité et partage', icon: 'ri-lock-2-line' },
        { id: 'modifications', label: 'Modifications', icon: 'ri-refresh-line' },
    ];

    readonly purposes = ['Gestion des achats', 'Envoi d’offres promotionnelles'];

    readonly legalBases = [
        'Consentement explicite de l\'utilisateur',
        'Exécution d’un contrat (achat de musique)',
        'Obligation légale (facturation)',
        'Intérêt légitime (amélioration des services, sécurité)',
    ];

    readonly retention = [
        { label: 'Comptes clients', duration: 'jusqu’à suppression par l’utilisateur' },
        { label: 'Facturation', duration: '10 ans' },
        { label: 'Historique', duration: '2 ans maximum' },
    ];

    readonly rights = [
        { label: 'Droit d’accès', icon: 'ri-eye-line' },
        { label: 'Droit de rectification', icon: 'ri-edit-line' },
        { label: 'Droit à l’effacement', icon: 'ri-delete-bin-line' },
        { label: 'Droit à la portabilité', icon: 'ri-download-2-line' },
        { label: 'Droit d’opposition', icon: 'ri-forbid-line' },
        { label: 'Droit à la limitation', icon: 'ri-pause-circle-line' },
    ];

    constructor(private categoryService: CategoryService, private docTitle: Title) { }

    ngOnInit() {
        this.getBackground();
        this.docTitle.setTitle("Données personnelles (RGPD) | Creatoke");
    }

    async getBackground() {
        this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
    }

    // Les ancres #id ne fonctionnent pas avec le routeur Angular : défilement manuel.
    scrollTo(id: string) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
