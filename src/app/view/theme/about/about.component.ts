import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CategoryService } from 'src/app/core/services/api/category.service';

interface TocEntry {
    id: string;
    label: string;
    icon: string;
}

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {
    picturebackground: any;

    readonly contactEmail = 'contact@creatoke.fr';

    readonly toc: TocEntry[] = [
        { id: 'editeur', label: 'Éditeur du site', icon: 'ri-building-line' },
        { id: 'propriete', label: 'Propriété intellectuelle', icon: 'ri-copyright-line' },
        { id: 'donnees', label: 'Données personnelles', icon: 'ri-database-2-line' },
        { id: 'cookies', label: 'Cookies', icon: 'ri-eye-off-line' },
        { id: 'droit', label: 'Droit applicable', icon: 'ri-scales-3-line' },
        { id: 'rgpd', label: 'Politique de confidentialité', icon: 'ri-shield-user-line' },
        { id: 'licences', label: 'Contrats de licence', icon: 'ri-file-list-3-line' },
    ];

    constructor(private categoryService: CategoryService, private docTitle: Title) { }

    ngOnInit() {
        this.getBackground();
        this.docTitle.setTitle("Mentions légales | Creatoke");
    }

    async getBackground() {
        this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
    }

    // Les ancres #id ne fonctionnent pas avec le routeur Angular : défilement manuel.
    scrollTo(id: string) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
