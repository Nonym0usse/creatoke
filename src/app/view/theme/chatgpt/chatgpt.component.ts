import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CategoryService } from 'src/app/core/services/api/category.service';
import { NotifyService } from 'src/app/core/services/global/notify.service';

type Kind = 'read' | 'action';

interface Capability {
    label: string;
    detail?: string;
    example: string;
    kind: Kind;
}

interface Topic {
    id: string;
    label: string;
    icon: string;
    items: Capability[];
}

// Adresse du connecteur MCP (API, routes/mcp.ts)
const MCP_URL = 'https://api.creatoke.fr/mcp';

// Page /chatgpt (administrateurs) : ce que l'assistant IA peut faire sur Créatoké via le connecteur MCP.
// À tenir à jour avec les outils de creatoke-api (mcp/tools.ts et mcp/actions.ts).
@Component({
    selector: 'app-chatgpt',
    templateUrl: './chatgpt.component.html',
    styleUrls: ['./chatgpt.component.scss']
})
export class ChatgptComponent implements OnInit {
    picturebackground: any;
    readonly mcpUrl = MCP_URL;

    readonly topics: Topic[] = [
        {
            id: 'catalogue', label: 'Chansons et catalogue', icon: 'ri-disc-line', items: [
                { label: 'Rechercher des chansons', example: 'Quelles chansons parlent de Paris ?', kind: 'read' },
                { label: 'Consulter une fiche', detail: 'prix, licences, fichiers', example: 'Combien coûte la licence de MUITA ?', kind: 'read' },
                { label: 'Voir les rubriques du catalogue', example: 'Quelles sont les rubriques du site ?', kind: 'read' },
                { label: 'Importer un fichier depuis un lien', detail: 'Google Drive, Dropbox ou lien direct : MP3, WAV, image', example: 'Récupère le MP3 de ce lien Drive.', kind: 'action' },
                { label: 'Créer une chanson', example: 'Ajoute cette chanson dans « Chansons à chanter » à 39 €, fichiers dans ce lien Drive.', kind: 'action' },
                { label: 'Modifier une chanson', detail: 'prix, textes, rubrique, fichiers', example: 'Passe toutes les virgules sonores à 15 €.', kind: 'action' },
                { label: 'Supprimer une chanson', detail: 'une à la fois', example: 'Retire « Les propos haineux » du site.', kind: 'action' },
                { label: 'Créer, modifier ou supprimer une rubrique', example: 'Crée une rubrique « Chansons de Noël ».', kind: 'action' },
            ]
        },
        {
            id: 'video', label: 'Vidéos et réseaux sociaux', icon: 'ri-video-upload-line', items: [
                { label: 'Publier une vidéo', detail: 'Instagram, TikTok, YouTube, Facebook, LinkedIn, X, Threads et Bluesky, à partir d\'un lien Google Drive ou Dropbox', example: 'Publie cette vidéo sur tous les réseaux.', kind: 'action' },
                { label: 'Un texte adapté à chaque réseau', detail: 'et le choix des réseaux', example: 'Description complète pour YouTube, hashtags pour Instagram, ton professionnel pour LinkedIn, seulement ces trois réseaux.', kind: 'action' },
                { label: 'Joindre le lien d\'une chanson', detail: 'ajouté à la fin du texte, il ouvre la fiche et la prise de rendez-vous Calendly', example: 'Publie la vidéo avec le lien de MUITA.', kind: 'action' },
                { label: 'Voir les vidéos publiées et le résultat de chaque réseau', example: 'La vidéo est-elle bien partie sur YouTube ? · Qu\'a-t-on publié ce mois-ci ?', kind: 'read' },
            ]
        },
        {
            id: 'ventes', label: 'Ventes et licences', icon: 'ri-money-euro-circle-line', items: [
                { label: 'Chiffre d\'affaires et statistiques', example: 'Combien a-t-on vendu en septembre ? Quelle chanson se vend le mieux ?', kind: 'read' },
                { label: 'Liste des ventes', example: 'Montre les ventes de la semaine.', kind: 'read' },
                { label: 'Consulter une facture', example: 'Retrouve la facture de la dernière vente.', kind: 'read' },
                { label: 'Lire les contrats de licence', detail: 'MP3 et WAV', example: 'Que dit la licence WAV sur la durée ?', kind: 'read' },
                { label: 'Modifier un texte de licence', example: 'Mets à jour la clause de durée de la licence WAV.', kind: 'action' },
                { label: 'Bilan mensuel par e-mail', detail: 'chiffre d\'affaires, évolution, meilleures ventes ; envoyé automatiquement le 1er du mois', example: 'Renvoie-moi le bilan de septembre.', kind: 'action' },
            ]
        },
        {
            id: 'prospection', label: 'Prospection des éditeurs', icon: 'ri-user-search-line', items: [
                { label: 'Voir les prospects et leur avancement', example: 'Qui n\'a pas répondu depuis deux semaines ?', kind: 'read' },
                { label: 'Consulter un prospect', example: 'Où en est l\'éditeur X ?', kind: 'read' },
                { label: 'Ajouter ou modifier un prospect', example: 'Ajoute l\'éditeur X, contact Marie, marie@exemple.fr.', kind: 'action' },
                { label: 'Envoyer l\'e-mail de présentation', example: 'Envoie la présentation aux trois nouveaux prospects.', kind: 'action' },
                { label: 'Marquer un prospect comme ayant répondu', detail: 'ses relances s\'arrêtent', example: 'L\'éditeur X a répondu, arrête ses relances.', kind: 'action' },
                { label: 'Lire les modèles d\'e-mails de relance', example: 'Montre-moi la 2e relance.', kind: 'read' },
                { label: 'Modifier un modèle d\'e-mail', example: 'Rends la 2e relance plus courte et plus chaleureuse.', kind: 'action' },
                { label: 'Lancer les relances maintenant', example: 'Envoie les relances du jour.', kind: 'action' },
            ]
        },
        {
            id: 'site', label: 'Contenu du site et messages', icon: 'ri-layout-line', items: [
                { label: 'Lire le texte de l\'accueil', example: 'Que dit le texte de l\'accueil ?', kind: 'read' },
                { label: 'Modifier le texte de l\'accueil', example: 'Ajoute une phrase sur les nouvelles virgules sonores.', kind: 'action' },
                { label: 'Changer l\'image de fond', example: 'Mets cette photo en fond.', kind: 'action' },
                { label: 'Lire les commentaires', example: 'Montre les derniers commentaires.', kind: 'read' },
                { label: 'Supprimer un commentaire', example: 'Supprime les spams.', kind: 'action' },
                { label: 'Lire les messages du formulaire de contact', example: 'Résume les demandes reçues cette semaine. · Quels messages restent à traiter ?', kind: 'read' },
                { label: 'Marquer des messages comme traités', example: 'J\'ai répondu à Marie Dupont, marque son message comme traité.', kind: 'action' },
            ]
        },
    ];

    readonly toc = [
        { id: 'principe', label: 'Le principe', icon: 'ri-lightbulb-line' },
        { id: 'connexion', label: 'Connecter ChatGPT', icon: 'ri-plug-line' },
        ...this.topics.map(t => ({ id: t.id, label: t.label, icon: t.icon })),
        { id: 'limites', label: 'Bon à savoir', icon: 'ri-shield-check-line' },
    ];

    constructor(private categoryService: CategoryService, private docTitle: Title, private notify: NotifyService) { }

    ngOnInit() {
        this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
        this.docTitle.setTitle('ChatGPT et Créatoké | Creatoke');
    }

    // Les ancres #id ne fonctionnent pas avec le routeur Angular : défilement manuel.
    scrollTo(id: string) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    copyUrl() {
        navigator.clipboard?.writeText(this.mcpUrl)
            .then(() => this.notify.success('Adresse du connecteur copiée.'))
            .catch(() => this.notify.info(`Adresse du connecteur : ${this.mcpUrl}`));
    }
}
