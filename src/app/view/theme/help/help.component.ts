import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CategoryService } from 'src/app/core/services/api/category.service';
import { AuthenticationService } from 'src/app/core/services/global/authentication.service';

interface TocEntry {
    id: string;
    label: string;
    icon: string;
}

// Aide pour les visiteurs et clients (page publique /aide).
@Component({
    selector: 'app-help',
    templateUrl: './help.component.html'
})
export class HelpComponent implements OnInit {
    picturebackground: any;
    isAdmin = false;

    readonly toc: TocEntry[] = [
        { id: 'catalogue', label: 'Découvrir le catalogue', icon: 'ri-compass-3-line' },
        { id: 'ecouter', label: 'Écouter', icon: 'ri-play-circle-line' },
        { id: 'licences', label: 'Choisir une licence', icon: 'ri-price-tag-3-line' },
        { id: 'acheter', label: 'Acheter et payer', icon: 'ri-shopping-cart-line' },
        { id: 'telecharger', label: 'Téléchargement et facture', icon: 'ri-download-cloud-line' },
        { id: 'commentaires', label: 'Laisser un avis', icon: 'ri-chat-3-line' },
        { id: 'faq', label: 'Questions fréquentes', icon: 'ri-question-line' },
    ];

    constructor(
        private categoryService: CategoryService,
        private authenticationService: AuthenticationService,
        private docTitle: Title
    ) { }

    ngOnInit() {
        this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
        this.authenticationService.isAuthenticated().subscribe(isAuth => this.isAdmin = isAuth);
        this.docTitle.setTitle("Aide | Creatoke");
    }

    // Les ancres #id ne fonctionnent pas avec le routeur Angular : défilement manuel.
    scrollTo(id: string) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
