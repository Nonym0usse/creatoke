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

    readonly lastUpdate = '12/10/2026';
    readonly contactEmail = 'contact@creatoke.fr';

    readonly toc: TocEntry[] = [
        { id: 'donnees', label: 'Données collectées', icon: 'ri-database-2-line' },
        { id: 'finalite', label: 'Finalités', icon: 'ri-focus-3-line' },
        { id: 'base-legale', label: 'Bases légales', icon: 'ri-scales-3-line' },
        { id: 'destinataires', label: 'Destinataires', icon: 'ri-share-forward-line' },
        { id: 'assistant-ia', label: 'Assistant IA', icon: 'ri-robot-line' },
        { id: 'conservation', label: 'Conservation', icon: 'ri-archive-line' },
        { id: 'navigateur', label: 'Navigateur et cookies', icon: 'ri-computer-line' },
        { id: 'droits', label: 'Vos droits', icon: 'ri-user-settings-line' },
        { id: 'modifications', label: 'Modifications', icon: 'ri-refresh-line' },
    ];

    // Ce que le site collecte réellement, selon l'endroit où la donnée est saisie.
    readonly collected = [
        { label: 'Achat d\'une licence', detail: 'nom et adresse e-mail transmis par PayPal, chanson et licence achetées, montant et date (pour la livraison et la facture). Nous ne recevons jamais vos coordonnées bancaires.' },
        { label: 'Formulaire de contact', detail: 'nom, adresse e-mail, téléphone et message.' },
        { label: 'Commentaires', detail: 'nom, adresse e-mail (non publiée), note et texte du commentaire.' },
        { label: 'Prospection professionnelle', detail: 'pour les éditeurs et professionnels de la musique que nous contactons : nom, prénom, e-mail professionnel, société et historique des e-mails envoyés.' },
    ];

    readonly purposes = [
        'Gestion des achats : livraison des fichiers et facturation',
        'Réponse aux messages envoyés par le formulaire de contact',
        'Publication et modération des commentaires',
        'Présentation de notre catalogue à des professionnels de la musique (prospection)',
        'Protection du site contre les envois automatisés (anti-spam)',
    ];

    readonly legalBases = [
        'Exécution d’un contrat : l’achat d’une licence',
        'Obligation légale : conservation des factures',
        'Intérêt légitime : réponse aux messages, modération, prospection professionnelle, sécurité du site',
        'Consentement : publication de votre commentaire',
    ];

    readonly recipients = [
        { name: 'o2switch', role: 'hébergement du site et des données (France)' },
        { name: 'PayPal', role: 'paiement des licences' },
        { name: 'Google reCAPTCHA', role: 'protection anti-spam du formulaire de contact' },
        { name: 'Calendly', role: 'prise de rendez-vous, si vous choisissez de réserver un échange' },
    ];

    readonly retention = [
        { label: 'Achats et factures', duration: '10 ans (obligation comptable)' },
        { label: 'Messages du formulaire de contact', duration: '3 ans maximum' },
        { label: 'Commentaires', duration: 'tant qu’ils sont publiés' },
        { label: 'Prospects professionnels', duration: '3 ans après le dernier échange' },
    ];

    readonly rights = [
        { label: 'Droit d’accès', icon: 'ri-eye-line' },
        { label: 'Droit de rectification', icon: 'ri-edit-line' },
        { label: 'Droit à l’effacement', icon: 'ri-delete-bin-line' },
        { label: 'Droit à la portabilité', icon: 'ri-download-2-line' },
        { label: 'Droit d’opposition (notamment à la prospection)', icon: 'ri-forbid-line' },
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
