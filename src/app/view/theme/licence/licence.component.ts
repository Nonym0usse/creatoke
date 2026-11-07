import { Component, HostListener, OnInit } from '@angular/core';
import { LicenceService } from "../../../core/services/api/licence.service";
import { CategoryService } from "../../../core/services/api/category.service";
import { Title } from '@angular/platform-browser';
import { NotifyService } from "../../../core/services/global/notify.service";

// Champs de la table des licences (noms historiques de l'API : base_plus = premium, premium = pro)
type LicenceKey = 'basic' | 'base_plus' | 'premium' | 'contract_mp3' | 'contract_wav';

interface LicenceDoc {
  key: LicenceKey;
  label: string;
  icon: string;
  format: string;
  where: string;
  link?: { label: string; url: string };
}

// Textes des licences (affichés sur les fiches) et des contrats (page publique « Contrats de licence »)
@Component({
  selector: 'app-licence',
  templateUrl: './licence.component.html',
  styleUrls: ['./licence.component.scss']
})
export class LicenceComponent implements OnInit {

  picturebackground: any;

  readonly groups: { title: string; hint: string; docs: LicenceDoc[] }[] = [
    {
      title: 'Licences', hint: 'Affichées sur toutes les fiches chansons, sous le prix de chaque offre.', docs: [
        { key: 'basic', label: 'Licence de base', icon: 'ri-file-music-line', format: 'MP3',
          where: 'Affichée sur toutes les fiches, dans « Ce qui est inclus » des offres Licence de base (chanson et créatoké).' },
        { key: 'base_plus', label: 'Licence premium', icon: 'ri-vip-crown-line', format: 'WAV',
          where: 'Affichée sur toutes les fiches, dans « Ce qui est inclus » des offres Licence premium (chanson et créatoké).' },
        { key: 'premium', label: 'Licence pro et exclusivité', icon: 'ri-award-line', format: 'Sur mesure',
          where: 'Affichée sur toutes les fiches, dans l\'offre « Licence pro et exclusivité ».' },
      ]
    },
    {
      title: 'Contrats', hint: 'Texte juridique complet, sur la page publique « Contrats de licence ».', docs: [
        { key: 'contract_mp3', label: 'Contrat MP3', icon: 'ri-file-text-line', format: 'MP3',
          where: 'Affiché sur la page publique « Contrats de licence », onglet MP3.',
          link: { label: 'Voir la page', url: '/contrats-licence' } },
        { key: 'contract_wav', label: 'Contrat WAV', icon: 'ri-file-text-line', format: 'WAV',
          where: 'Affiché sur la page publique « Contrats de licence », onglet WAV.',
          link: { label: 'Voir la page', url: '/contrats-licence' } },
      ]
    },
  ];

  readonly docs: LicenceDoc[] = this.groups.flatMap(g => g.docs);

  selected: LicenceKey = 'basic';
  loading = true;
  saving = false;

  // Textes enregistrés (API) et textes en cours de modification
  private saved: Partial<Record<LicenceKey, string>> = {};
  edits: Partial<Record<LicenceKey, string>> = {};
  private id: string | undefined;

  constructor(private licenceService: LicenceService, private categoryService: CategoryService, private title: Title,
    private notify: NotifyService) {
  }

  ngOnInit(): void {
    this.title.setTitle('Créatoke | Textes des licences');
    this.getBackground();
    this.licenceService.listLicence({ force: true })
      .then(r => {
        const row = r.data?.[0] ?? {};
        this.id = row.id;
        for (const doc of this.docs) this.saved[doc.key] = row[doc.key] ?? '';
      })
      .catch(() => this.notify.error('Les textes des licences n\'ont pas pu être chargés. Rechargez la page.'))
      .finally(() => this.loading = false);
  }

  get current(): LicenceDoc {
    return this.docs.find(d => d.key === this.selected) ?? this.docs[0];
  }

  valueOf(key: LicenceKey): string {
    return this.edits[key] ?? this.saved[key] ?? '';
  }

  onEdit(key: LicenceKey, value: string) {
    this.edits[key] = value;
  }

  // L'éditeur peut réécrire le HTML sans changement réel (espaces, balises vides) : on compare le texte normalisé
  private normalize(html: string | undefined): string {
    return (html ?? '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').replace(/<p>\s*<\/p>/g, '').trim();
  }

  isDirty(key: LicenceKey): boolean {
    return this.edits[key] !== undefined && this.normalize(this.edits[key]) !== this.normalize(this.saved[key]);
  }

  get dirtyDocs(): LicenceDoc[] {
    return this.docs.filter(d => this.isDirty(d.key));
  }

  isEmpty(key: LicenceKey): boolean {
    return !this.normalize(this.valueOf(key)).replace(/<[^>]+>/g, '').trim();
  }

  select(key: LicenceKey) {
    this.selected = key;
  }

  discard() {
    // Les éditeurs se rechargent avec le texte enregistré
    this.edits = {};
  }

  async submit() {
    const changed = this.dirtyDocs;
    if (!changed.length || this.saving || !this.id) return;
    this.saving = true;
    const body: Record<string, string> = { id: this.id };
    for (const doc of changed) body[doc.key] = this.edits[doc.key] ?? '';
    try {
      await this.licenceService.modifyLicence(body);
      for (const doc of changed) this.saved[doc.key] = this.edits[doc.key];
      this.edits = {};
      this.notify.success(changed.length > 1 ? `${changed.length} textes enregistrés.` : `« ${changed[0].label} » enregistrée.`);
    } catch {
      this.notify.error('Les textes n\'ont pas pu être enregistrés. Réessayez dans un instant.');
    } finally {
      this.saving = false;
    }
  }

  // Prévient avant de quitter la page avec des modifications non enregistrées
  @HostListener('window:beforeunload', ['$event'])
  beforeUnload(event: BeforeUnloadEvent) {
    if (this.dirtyDocs.length) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  async getBackground() {
    this.categoryService.getBackgroundImg().then(r => { this.picturebackground = r.data[0]?.picture });
  }
}
