import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ProspectService } from 'src/app/core/services/api/prospect.service';
import { SongService } from 'src/app/core/services/api/song.service';
import { CategoryService } from 'src/app/core/services/api/category.service';

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
        private title: Title
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
    }

    openEdit(prospect: any) {
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
            alert('Veuillez renseigner au minimum un nom/prénom et un email.');
            return;
        }
        this.loading = true;
        const payload = { ...this.form, ...this.songFields() };
        const request = this.editingId
            ? this.prospectService.updateProspect({ id: this.editingId, ...payload })
            : this.prospectService.createProspect(payload);

        request
            .then(() => {
                this.showForm = false;
                this.editingId = null;
                this.loadProspects();
            })
            .catch(() => alert('Erreur lors de l\'enregistrement du contact.'))
            .finally(() => this.loading = false);
    }

    sendPresentation(prospect: any) {
        if (!confirm(`Envoyer l'email de présentation à ${prospect.prenom} ${prospect.nom} (${prospect.email}) ?\nLa séquence de relances automatiques (J+10, J+30, J+60) démarrera.`)) return;
        this.loading = true;
        this.prospectService.sendPresentation(prospect.id)
            .then(() => this.loadProspects())
            .catch(() => alert('Erreur lors de l\'envoi de la présentation.'))
            .finally(() => this.loading = false);
    }

    markReplied(prospect: any) {
        if (!confirm(`Marquer ${prospect.prenom} ${prospect.nom} comme « A répondu » ?\nLes relances automatiques seront stoppées.`)) return;
        this.prospectService.markReplied(prospect.id)
            .then(() => this.loadProspects())
            .catch(() => alert('Erreur.'));
    }

    delete(prospect: any) {
        if (!confirm(`Supprimer le contact ${prospect.prenom} ${prospect.nom} ?`)) return;
        this.prospectService.deleteProspect(prospect.id)
            .then(() => this.loadProspects())
            .catch(() => alert('Erreur lors de la suppression.'));
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
        const seconds = timestamp._seconds ?? timestamp.seconds;
        if (seconds === undefined) return '—';
        return new Date(seconds * 1000).toLocaleDateString('fr-FR');
    }

    async getBackground() {
        this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
    }
}
