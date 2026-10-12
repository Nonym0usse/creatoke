import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ProspectService } from 'src/app/core/services/api/prospect.service';
import { SongService } from 'src/app/core/services/api/song.service';
import { CategoryService } from 'src/app/core/services/api/category.service';
import { NotifyService } from 'src/app/core/services/global/notify.service';

@Component({
    selector: 'app-prospects',
    templateUrl: './prospects.component.html',
    styleUrls: ['./prospects.component.scss']
})
export class ProspectsComponent implements OnInit {

    prospects: any[] = [];
    songs: any[] = [];
    picturebackground: any;
    loading = false;

    showForm = false;
    editingId: string | null = null;
    form = this.emptyForm();

    expandedId: string | null = null;

    // Édition des emails de la séquence (sujet + corps texte).
    showTemplates = false;
    templates: any[] = [];
    selectedTemplateKey = '';
    templateForm = { subject: '', body: '' };
    templateLoading = false;
    placeholders = ['{prenom}', '{nom}', '{societe}', '{titre}', '{lien}'];

    statusLabels: any = {
        draft: 'Brouillon',
        active: 'Séquence en cours',
        replied: 'A répondu',
        closed: 'En attente (J+90)'
    };

    stepLabels: any = {
        0: 'Non envoyé',
        1: 'Envoi initial (J0)',
        2: '1er rappel (J+10)',
        3: '2e rappel (J+30)',
        4: '3e rappel (J+60)'
    };

    constructor(
        private prospectService: ProspectService,
        private songService: SongService,
        private categoryService: CategoryService,
        private title: Title,
        private notify: NotifyService
    ) { }

    ngOnInit(): void {
        this.loadProspects();
        this.songService.getAllSongs().then((music) => this.songs = music.data).catch((err) => console.error(err));
        this.getBackground();
        this.title.setTitle('Créatoke | Contacts');
    }

    emptyForm() {
        return {
            nom: '',
            prenom: '',
            email: '',
            societe: '',
            id_song: '',
            notes: ''
        };
    }

    loadProspects() {
        this.prospectService.listProspects()
            .then(r => this.prospects = r.data)
            .catch((err) => console.error(err));
    }

    openCreate() {
        this.editingId = null;
        this.form = this.emptyForm();
        this.showForm = true;
        this.showTemplates = false;
    }

    openEdit(prospect: any) {
        this.showTemplates = false;
        this.editingId = prospect.id;
        this.form = {
            nom: prospect.nom ?? '',
            prenom: prospect.prenom ?? '',
            email: prospect.email ?? '',
            societe: prospect.societe ?? '',
            id_song: prospect.id_song ?? '',
            notes: prospect.notes ?? ''
        };
        this.showForm = true;
    }

    cancelForm() {
        this.showForm = false;
        this.editingId = null;
    }

    private songFields() {
        const song = this.songs.find(s => s.id === this.form.id_song);
        if (!song) return { id_song: '', lien_musique: '', titre_chanson: '' };
        return {
            id_song: song.id,
            lien_musique: `${window.location.origin}/song/${song.category}/${song.slug}`,
            titre_chanson: song.title
        };
    }

    submit() {
        if (!this.form.email || (!this.form.nom && !this.form.prenom)) {
            this.notify.warning('Renseignez au minimum un nom ou un prénom, et une adresse email.');
            return;
        }
        this.loading = true;
        const payload = { ...this.form, ...this.songFields() };
        const request = this.editingId
            ? this.prospectService.updateProspect({ id: this.editingId, ...payload })
            : this.prospectService.createProspect(payload);

        request
            .then(() => {
                this.notify.success(this.editingId ? 'Le contact est mis à jour.' : 'Le contact est ajouté.');
                this.showForm = false;
                this.editingId = null;
                this.loadProspects();
            })
            .catch(() => this.notify.error('Le contact n\'a pas pu être enregistré. Réessayez dans un instant.'))
            .finally(() => this.loading = false);
    }

    async sendPresentation(prospect: any) {
        const ok = await this.notify.confirm({
            title: `Envoyer l'email de présentation à ${prospect.prenom} ${prospect.nom} ?`,
            message: `Il partira à ${prospect.email}.\nLes relances automatiques (J+10, J+30, J+60) démarreront ensuite.`,
            confirmLabel: 'Envoyer',
        });
        if (!ok) return;
        this.loading = true;
        this.prospectService.sendPresentation(prospect.id)
            .then(() => {
                this.notify.success(`L'email de présentation est parti à ${prospect.email}.`);
                this.loadProspects();
            })
            .catch(() => this.notify.error('L\'email n\'a pas pu être envoyé. Réessayez dans un instant.'))
            .finally(() => this.loading = false);
    }

    async markReplied(prospect: any) {
        const ok = await this.notify.confirm({
            title: `${prospect.prenom} ${prospect.nom} a répondu ?`,
            message: 'Les relances automatiques seront arrêtées pour ce contact.',
            confirmLabel: 'Oui, a répondu',
        });
        if (!ok) return;
        this.prospectService.markReplied(prospect.id)
            .then(() => {
                this.notify.success('Contact marqué « A répondu » : les relances sont arrêtées.');
                this.loadProspects();
            })
            .catch(() => this.notify.error('Le contact n\'a pas pu être mis à jour. Réessayez dans un instant.'));
    }

    async delete(prospect: any) {
        const ok = await this.notify.confirm({
            title: `Supprimer ${prospect.prenom} ${prospect.nom} ?`,
            message: 'Le contact et son historique seront supprimés. Cette action est définitive.',
            confirmLabel: 'Supprimer',
            danger: true,
        });
        if (!ok) return;
        this.prospectService.deleteProspect(prospect.id)
            .then(() => {
                this.notify.success('Le contact a été supprimé.');
                this.loadProspects();
            })
            .catch(() => this.notify.error('Le contact n\'a pas pu être supprimé. Réessayez dans un instant.'));
    }

    toggleTemplates() {
        if (this.showTemplates) {
            this.showTemplates = false;
            return;
        }
        this.showForm = false;
        this.templateLoading = true;
        this.prospectService.listTemplates()
            .then(r => {
                this.templates = r.data;
                this.showTemplates = true;
                this.selectTemplate(this.selectedTemplateKey || this.templates[0]?.key);
            })
            .catch(() => this.notify.error('Les modèles d\'emails n\'ont pas pu être chargés. Réessayez dans un instant.'))
            .finally(() => this.templateLoading = false);
    }

    selectTemplate(key: string) {
        const template = this.templates.find(t => t.key === key);
        if (!template) return;
        this.selectedTemplateKey = key;
        this.templateForm = { subject: template.subject, body: template.body };
    }

    get selectedTemplate() {
        return this.templates.find(t => t.key === this.selectedTemplateKey);
    }

    saveTemplate() {
        if (!this.templateForm.subject.trim() || !this.templateForm.body.trim()) {
            this.notify.warning('Le sujet et le contenu de l\'email doivent être remplis.');
            return;
        }
        this.templateLoading = true;
        this.prospectService.updateTemplate(this.selectedTemplateKey, {
            subject: this.templateForm.subject.trim(),
            body: this.templateForm.body.trim()
        })
            .then(() => {
                const template = this.selectedTemplate;
                if (template) {
                    template.subject = this.templateForm.subject.trim();
                    template.body = this.templateForm.body.trim();
                    template.custom = true;
                }
                this.notify.success('Les prochains envois utiliseront ce texte.', { title: 'Modèle enregistré' });
            })
            .catch(() => this.notify.error('Le modèle n\'a pas pu être enregistré. Réessayez dans un instant.'))
            .finally(() => this.templateLoading = false);
    }

    async resetTemplate() {
        const template = this.selectedTemplate;
        if (!template) return;
        const ok = await this.notify.confirm({
            title: `Rétablir le texte par défaut pour « ${template.label} » ?`,
            message: 'Votre version personnalisée sera supprimée.',
            confirmLabel: 'Rétablir',
            danger: true,
        });
        if (!ok) return;
        this.templateLoading = true;
        this.prospectService.resetTemplate(this.selectedTemplateKey)
            .then(r => {
                template.subject = r.data.subject;
                template.body = r.data.body;
                template.custom = false;
                this.templateForm = { subject: r.data.subject, body: r.data.body };
                this.notify.success('Le texte par défaut est rétabli.');
            })
            .catch(() => this.notify.error('Le modèle n\'a pas pu être rétabli. Réessayez dans un instant.'))
            .finally(() => this.templateLoading = false);
    }

    toggleHistory(prospect: any) {
        this.expandedId = this.expandedId === prospect.id ? null : prospect.id;
    }

    lastSent(prospect: any): string {
        const history = prospect.history ?? [];
        if (!history.length) return '—';
        const last = history[history.length - 1];
        return this.formatDate(last.sentAt);
    }

    formatDate(timestamp: any): string {
        if (!timestamp) return '—';
        // L'API renvoie des dates ISO ; l'ancien format Firestore reste accepté.
        const seconds = timestamp._seconds ?? timestamp.seconds;
        const date = seconds !== undefined ? new Date(seconds * 1000) : new Date(timestamp);
        if (Number.isNaN(date.getTime())) return '—';
        return date.toLocaleDateString('fr-FR');
    }

    async getBackground() {
        this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
    }
}
