import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CategoryService } from 'src/app/core/services/api/category.service';

interface TocEntry {
    id: string;
    label: string;
    icon: string;
}

// Guide d'administration détaillé (page /aide-admin, réservée aux administrateurs connectés).
@Component({
    selector: 'app-admin-help',
    templateUrl: './admin-help.component.html'
})
export class AdminHelpComponent implements OnInit {
    picturebackground: any;

    readonly toc: TocEntry[] = [
        { id: 'connexion', label: 'Connexion et compte', icon: 'ri-login-box-line' },
        { id: 'menu', label: 'Le menu Admin', icon: 'ri-menu-line' },
        { id: 'ajouter', label: 'Ajouter une chanson', icon: 'ri-upload-cloud-line' },
        { id: 'modifier', label: 'Modifier / supprimer', icon: 'ri-edit-line' },
        { id: 'prix', label: 'Prix et licences affichées', icon: 'ri-price-tag-3-line' },
        { id: 'licences', label: 'Textes des licences', icon: 'ri-file-list-3-line' },
        { id: 'site', label: 'Accueil et image de fond', icon: 'ri-layout-line' },
        { id: 'commentaires', label: 'Commentaires', icon: 'ri-chat-3-line' },
        { id: 'contacts', label: 'Contacts éditeurs', icon: 'ri-user-search-line' },
        { id: 'ventes', label: 'Ventes et factures', icon: 'ri-bill-line' },
        { id: 'stats', label: 'Statistiques', icon: 'ri-bar-chart-2-line' },
        { id: 'video', label: 'Publier une vidéo', icon: 'ri-video-upload-line' },
        { id: 'problemes', label: 'Problèmes fréquents', icon: 'ri-tools-line' },
    ];

    constructor(private categoryService: CategoryService, private docTitle: Title) { }

    ngOnInit() {
        this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
        this.docTitle.setTitle("Guide d'administration | Creatoke");
    }

    // Les ancres #id ne fonctionnent pas avec le routeur Angular : défilement manuel.
    scrollTo(id: string) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
